// Add.tsx

import React, { useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,
} from '../ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MainMenuButton } from './Button';
import { PlusIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import { useAppContext } from '@/contexts/AppContext';


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
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import ManageLocallyStoredSearchSystemsSheet from '../search/ManageLocallyStoredSearchSystems';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


export const AddSystem: React.FC<{ 
    defaultValues?: { name: string, description?: string, id: string, searchLink: string, favicon?: string }, onClose?: () => void
      }> = ({ defaultValues, onClose }) => {
    const { addLocallyStoredSearchSystem, locallyStoredSearchSystems, updateLocallyStoredSearchSystem } = useStorageContext();
    const { allSystems } = useSystemsContext();

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const onCloseRef = React.useRef(false);
    
    useEffect(() => {
      if (onClose && onCloseRef.current && !isDialogOpen) {
        onClose();
      }
      if (isDialogOpen && onClose) {
        onCloseRef.current = true;
      }
    }, [isDialogOpen, onClose]);



    const getSystemId = (name: string) => {
      return name.toLowerCase().replace(/\./g, '-').replace(/ /g, '-').replace(/@/g, '-');
    }

    const formSchema = z.object({
      searchSystemName: z.string().min(1, "A system name is required").refine((name) => {
        const nameExists = allSystems.some((system) => system.name === name && system.id !== defaultValues?.id);
            if (nameExists) {
                console.error(`System name '${name}' already exists.`);
                return false;
            }
            return true;
        }, {
            message: "System name already exists.",
        }).refine((name) => {
          const id = getSystemId(name);
          const idExists = allSystems.some((system) => system.id === id && system.id !== defaultValues?.id);
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
        description: z.string().optional(),
        favicon: z.string().optional(),
    });

    let setValues = defaultValues ? {
      searchSystemName: defaultValues.name,
      searchLink: defaultValues.searchLink,
      description: defaultValues.description || "",
      favicon: defaultValues.favicon || "",
    } : {
      searchSystemName: "",
      searchLink: "",
      description: "",
      favicon: "",
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
      defaultValues: setValues
    });

    let editsAttempted = false;
    if (defaultValues) {
    if (JSON.stringify(setValues) === JSON.stringify(form.getValues())) {
        editsAttempted = false;
    } else {
        editsAttempted = true;
        console.log(editsAttempted);
    }
    }
    const disableSubmit = (editsAttempted || !defaultValues) ? false : true;


    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
          console.log(`Submitting system: ${values.searchSystemName}`);
          if (defaultValues) {
            const defaultValuesSystemId = getSystemId(defaultValues?.name);
            const systemExists = allSystems.some(system => system.id === defaultValuesSystemId);
            if (systemExists) {
              updateLocallyStoredSearchSystem(defaultValuesSystemId, {
                id: getSystemId(values.searchSystemName),
                name: values.searchSystemName,
                searchLink: values.searchLink,
                description: values.description,
                favicon: values.favicon
              });
              console.log(`Updated search system: ${values.searchSystemName}`);
            }
          } else {
            addLocallyStoredSearchSystem({
              name: values.searchSystemName,
              id: getSystemId(values.searchSystemName),
              searchLink: values.searchLink,
              description: values.description,
              favicon: values.favicon
            });
            console.log(`Added search system: ${values.searchSystemName}`);
          }
          setIsDialogOpen(true); // Open the AlertDialog on success
          
        } catch (error) {
            console.error('Error adding search system:', error);
        }
    }

  const getSystemLink = ({ id, skipCheck }: { id: string, skipCheck?: boolean }) => {
      const systemExists = allSystems.some(system => system.id === id);

      if (systemExists) {
        const link = <a className="underline" href={`https://searchjunct.com/?systems=${id}`}>{id}</a>;
        if (skipCheck) {
          return link;
        }
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
                    name="searchSystemName"

                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormControl>
                          <>
                          <FormLabel>Search System Name</FormLabel>
                          <Input placeholder="" {...field} />
                          <FormDescription>
                              This is the name that will appear in the systems list.<br />
                              This will be used to generate the system ID: {field.value ? getSystemLink({id: getSystemId(field.value), skipCheck: true}) : '____'}
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
                                  <Input placeholder="Ex. https://www.example.com/search?q=%s" {...field} />
                            <FormDescription>
                              Provide the search URL (or search link), put a `%s` where the search query will go.
                            </FormDescription>
                            <FormMessage />
                            </>
                              </FormControl>
                          </FormItem >
                      )}
                  />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                          <FormItem className="mb-3">
                              <FormControl>
                                <>
                                  <FormLabel>Description</FormLabel>
                                  <Input placeholder="Optional" {...field} />
                            <FormDescription>
                              Provide a description for the search system.
                            </FormDescription>
                            <FormMessage />
                            </>
                              </FormControl>
                          </FormItem >
                      )}
                  />
                    <FormField
                      control={form.control}
                      name="favicon"
                      render={({ field }) => (
                          <FormItem className="mb-3">
                              <FormControl>
                                <>
                                  <FormLabel>Favicon</FormLabel>
                                  <Input placeholder="Optional" {...field} />
                            <FormDescription>
                              Provide a URL for the favicon of the search system.
                            </FormDescription>
                            <FormMessage />
                            </>
                              </FormControl>
                          </FormItem >
                      )}
                  />
                        <Button className="mt-3" type="submit" disabled={form.formState.isSubmitting || disableSubmit}>
                            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                        {onClose && (
                        <Button variant="outline" className="ml-3 mt-3" onClick={onClose}>
                            Cancel
                        </Button>)}
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
              <AlertDialogTitle>{`Successfully ${onClose ? 'edited' : 'added'} a search system!`}</AlertDialogTitle>
              <AlertDialogDescription>
                {`You just ${onClose ? 'edited' : 'added'} `}
                {getSystemLink({ id: getSystemId(form.getValues().searchSystemName), skipCheck: true })}
                {` ${onClose ? 'in' : 'to'} your locally stored search systems.`}
                <br />
                {`You now have ${locallyStoredSearchSystems.length} locally stored search system${locallyStoredSearchSystems.length !== 1 ? 's' : ''}.`}
              </AlertDialogDescription>
                </AlertDialogHeader>
            {onClose ? (<AlertDialogAction asChild>
              <Button size="sm" className="w-[300px] text-xs mx-auto bg-white text-black hover:bg-blue-100"
                autoFocus
                variant="outline"
                onClick={() => setIsDialogOpen(false)}>
                OK
              </Button>
            </AlertDialogAction>):(<>
                <AlertDialogAction asChild>
              <ManageLocallyStoredSearchSystemsSheet />
                </AlertDialogAction>
                <AlertDialogAction asChild>
              <Button size="sm" className="w-[300px] text-xs mx-auto bg-white text-black hover:bg-blue-100"
                variant="outline"
                onClick={(e) => { e.stopPropagation(); setIsDialogOpen(false); }}>
                    Return to Add Search System
                  </Button>
                </AlertDialogAction>
                <AlertDialogAction asChild>
              <Button size="sm" className="w-[300px] text-xs mx-auto bg-white text-black hover:bg-blue-100"
                      autoFocus
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}>
                        Return to Searchjunct
                    </Button>
                </AlertDialogAction></>)}
            </AlertDialogContent>
        </AlertDialog>
      </>
    );
};


const AddCard: React.FC = () => {
  const {locallyStoredSearchSystems} = useStorageContext();

    return (
      <Card className='rounded-md bg-white shadow-none mx-auto'>
        <ScrollArea className="h-[calc(100vh-45px)] sm:h-full w-[320px] sm:w-full">
        <CardTitle className='text-left pl-2 py-1 mb-2'>Add Search System</CardTitle>
        <CardContent className="p-0 flex items-left flex-col">
        <p
           className="text-xs text-gray-500 px-2 w-[95%] break-words">
            Add a new search system to your locally stored systems list.
            These systems are only available to you. They will be saved in
            your web browser and will not be synced to other devices.
          </p>
          
            <Alert className='mt-2 w-[95%] mx-auto'>
              <p
                className="text-xs text-gray-500 mt-3 px-2 w-[95%] break-words">
                You have {locallyStoredSearchSystems.length} locally stored search system{locallyStoredSearchSystems.length !== 1 ? 's' : ''}.
              </p>
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

