// cards/Settings/CustomMultisearch.tsx

import React from 'react';
import { z } from "zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from '../shadcn-ui/card';
import { useSystemsContext } from '../contexts/SystemsContext';
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormDescription, FormLabel, FormControl, FormMessage } from '../shadcn-ui/form';
import { Input } from '../shadcn-ui/input';
import { Button } from '../shadcn-ui/button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useStorage } from '../contexts/StorageContext';
import { SpecialCardTitle } from '../ui/SystemTitle';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../shadcn-ui/alert-dialog';
if (typeof window !== 'undefined') {
  console.log('window is defined');
}

const AddMultisearchShortcut: React.FC = () => {
  const { multisearchShortcuts, addMultisearchShortcut } = useStorage();
  const { systems } = useSystemsContext();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "A shortcut name is required").refine((name) => {
      if (/\s/.test(name)) {
        console.error("Shortcut name cannot contain spaces.");
        return false;
      }
      return true;
    }, {
      message: "Shortcut name cannot contain spaces.",
    }).refine((name) => {
      const nameExists = multisearchShortcuts.some((shortcut) => shortcut.name === name);
      if (nameExists) {
        console.error(`Shortcut name '${name}' already exists.`);
        return false;
      }
      return true;
    }, {
      message: "Shortcut name already exists.",
    }),
    description: z.string().optional(),
    systems: z.object({
      always: z.array(z.string()),
      randomly: z.array(z.string()),
    }),
    count_from_randomly: z.union([z.string(), z.number()]).optional().refine(val => {
      if (val === undefined) {
        return true;
      }
      if (val === "") {
        return true;
      }
      if (typeof val === 'string') {
        return !isNaN(parseInt(val, 10));
      }
      return true;
    }, {
      message: "Must be a valid integer",
    }).optional(),
  });

  const systemNames = systems.map((system) => ({
    label: system.name,
    value: system.id,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    
    defaultValues: {
      name: "",
      description: "",
      systems: {
        always: [],
        randomly: [],
      },
      count_from_randomly: 0
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(`Submitting shortcut: ${values.name}`);
      const count = values.systems.randomly.length > 0 ? values.count_from_randomly || 1 : 0;
      addMultisearchShortcut({
        name: values.name,
        systems: values.systems,
        count_from_randomly: (typeof count === 'string' ? parseInt(count, 10) : count),
      });
      console.log(`Added shortcut: ${values.name}`);
      setIsDialogOpen(true); // Open the AlertDialog on success
    } catch (error) {
      console.error('Error adding shortcut:', error);
    }
  }

  return (
    <>
      <Card className="w-full m-2 py-0 mx-auto">
        <CardHeader className='py-2 ml-0 pl-0'>
          <SpecialCardTitle title="Add Shortcut" />
            <CardDescription className='ml-4 p-0 my-0'>
              Add a new multisearch shortcut.
            </CardDescription>
        </CardHeader>
      <CardContent>
        
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                
                render={({ field }) => (
                  <FormItem className="space-y-0 mb-3">
                    <FormControl>
                      <Input placeholder="Example: `links`, `code`, `alt`" {...field} />
                    </FormControl>
                    <FormDescription>
                      Name this multisearch shortcut.
                    </FormDescription>
                    <FormMessage />
                  </FormItem >
                )}
              />
              <FormField
                control={form.control}
                name="description"

                render={({ field }) => (
                  <FormItem className="space-y-0 mb-3">
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: Add a description for this multisearch shortcut.
                    </FormDescription>
                    <FormMessage />
                  </FormItem >
                )}
              />
              <Controller
                name="systems.always"
                control={form.control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    options={systemNames}
                    getOptionLabel={(option) => option.label}
                    value={value ? value.map((val: string) => systemNames.find(option => option.value === val) || { label: '', value: '' }) : []}
                    onChange={(_, data) => onChange(data.map(item => item.value))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Always"
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option ? option.label : ''} {...getTagProps({ index })} />
                      ))
                    }
                  />
                )}
              />
              <FormDescription className="mb-3">
                Select the systems to always search with.
              </FormDescription>
              <Controller
                name="systems.randomly"
                control={form.control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    options={systemNames}
                    getOptionLabel={(option) => option.label}
                    value={value ? value.map((val: string) => systemNames.find(option => option.value === val) || { label: '', value: '' }) : []}
                    onChange={(_, data) => onChange(data.map(item => item.value))}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Randomly"
                        error={!!error}
                        helperText={error ? error.message : null}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option ? option.label : ''} {...getTagProps({ index })} />
                      ))
                    }
                  />
                )}
              />
              <FormDescription className="mb-3">
                Select the systems to have Searchjunct randomly select from the 'Randomly' list.
              </FormDescription>
              {form.watch("systems.randomly").length >= 2 && (
                <FormField
                  control={form.control}
                  name="count_from_randomly"

                  render={({ field: { onChange, value, ...restField } }) => (
                    <FormItem>
                      <FormLabel>Count from Randomly</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="" 
                          value={value} 
                          onChange={e => onChange(e.target.value)} 
                          {...restField} 
                        />
                      </FormControl>
                      <FormDescription className="mb-3">
                        The number of search systems to generate from the 'Randomly' list.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button className="mt-3" type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
      </CardContent>
      </Card>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <button style={{ display: "none" }}>Open</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Successfully added shortcut!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogAction asChild>
            <button autoFocus onClick={() => setIsDialogOpen(false)}>Enter</button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddMultisearchShortcut;

