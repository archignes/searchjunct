// Add.tsx

import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,
} from '../ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitHubLogoIcon } from '@radix-ui/react-icons';


import { z } from "zod";
import { useSystemsContext } from '@/contexts/SystemsContext';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormDescription, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useStorageContext } from '@/contexts';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import ManageLocallyStoredSearchSystemsSheet from '../search/ManageLocallyStoredSearchSystems';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const AddSystem: React.FC = () => {
    const { locallyStoredSearchSystems, addLocallyStoredSearchSystem } = useStorageContext();
    const { systems } = useSystemsContext();
    const allSystems = [...locallyStoredSearchSystems, ...systems]

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);


    const getSystemId = (name: string) => {
      return name.toLowerCase().replace(/\./g, '-').replace(/ /g, '-').replace(/@/g, '-');
    }

    const formSchema = z.object({
        name: z.string().min(1, "A system name is required").refine((name) => {
          const nameExists = allSystems.some((system) => system.name === name);
            if (nameExists) {
                console.error(`System name '${name}' already exists.`);
                return false;
            }
            return true;
        }, {
            message: "System name already exists.",
        }).refine((name) => {
          const id = getSystemId(name);
          const idExists = allSystems.some((system) => system.id === id);
          if (idExists) {
            const existingName = allSystems.find((system) => system.id === id)?.name;
            console.error(`System ID '${id}' already exists for '${existingName}'.`);
            return false;
          }
          return true;
        }, {
          message: "System ID already exists for another system.",
        }),
        searchLink: z.string().url({
          message: "Search link must be a valid URL.",
        }),
    });


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

        defaultValues: {
            name: "",
            searchLink: "",
        },
    })



    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(`Submitting system: ${values.name}`);
            addLocallyStoredSearchSystem({
                name: values.name,
                id: getSystemId(values.name),
                searchLink: values.searchLink
            });
            console.log(`Added search system: ${values.name}`);
            setIsDialogOpen(true); // Open the AlertDialog on success
        } catch (error) {
            console.error('Error adding search system:', error);
        }
    }

    const getSystemLink = (id: string) => {
      const systemExists = allSystems.some(system => system.id === id);
      if (systemExists) {
        return (<span>
          <a className="underline" href={`https://searchjunct.com/?systems=${id}`}>
            {id}
            </a> already exists</span>);
      }
      return id;
    }


    return (
      <>
        <Card className="w-[95%] m-1 mx-auto py-1">
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                    name="name"

                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormControl>
                          <>
                          <FormLabel>Name</FormLabel>
                          <Input placeholder="Example Name" {...field} />
                          <FormDescription>
                              This is the name that will appear in the systems list.<br />
                              This will be used to generate the system ID: {field.value ? getSystemLink(getSystemId(field.value)) : '____'}
                              </FormDescription>
                          <FormMessage />
                          </>
                        </FormControl>
                      </FormItem>
                    )}
                    />
                    <FormField
                      control={form.control}
                      name="searchLink"
                      render={({ field }) => (
                          <FormItem className="mb-3">
                              <FormControl>
                                <>
                                  <FormLabel>Search Link</FormLabel>
                                  <Input placeholder="https://www.example.com/search?q=%s" {...field} />
                            <FormDescription>
                              Provide the search URL (or search link), put a `%s` where the search query will go.
                            </FormDescription>
                            <FormMessage />
                            </>
                              </FormControl>
                          </FormItem >
                      )}
                  />
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
                    <AlertDialogTitle>Successfully added a search system!</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogAction asChild>
                    <button autoFocus onClick={() => setIsDialogOpen(false)}>Enter</button>
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
      </>
    );
};


const AddCard: React.FC = () => {

    return (
      <Card className='rounded-md bg-white shadow-none mx-auto'>
        <ScrollArea className="h-[calc(100vh-200px)] w-[320px] sm:w-full">
        <CardTitle className='text-left pl-2 py-1 mb-2'>Add System</CardTitle>
        <CardContent className="p-0 flex items-left flex-col">
        <p
           className="text-xs text-gray-500 px-2 w-[95%] break-words">
            Add a new search system to your locally stored systems list.
            These systems are only available to you. They will be saved in
            your web browser and will not be synced to other devices.
          </p>
          
            <Alert className='mt-2 w-[95%] mx-auto'>
            <AlertTitle><ManageLocallyStoredSearchSystemsSheet /></AlertTitle>
            <AlertDescription className='text-xs'>You can remove, import, and export your locally stored search systems.</AlertDescription>
          </Alert>
            <p
              className="text-xs text-gray-500 mt-3 px-2 w-[95%] break-words">
              Add a search system here.
            </p>
            <AddSystem />
          </CardContent>
          <CardFooter className='flex p-2 bg-gray-200 flex-col items-center'>
            <span className="text-sm">You can suggest a system to be added to the public systems list here:</span>
            <Button variant="outline" className='mt-1'>
              <GitHubLogoIcon className='w-4 h-4 mr-2' />
              <a href="https://github.com/archignes/searchjunct/issues/new" target="_blank" rel="noopener noreferrer">
                Add Search System to Public List
              </a>
            </Button>
          </CardFooter>
      </ScrollArea>
      </Card>
    );
};

export default AddCard;

