// systems/Discussion.tsx

import React from 'react';
import { System } from "@/types";
import { platform_icons } from './utilities';
import { Document, Discussion, MicroPost, ThesesLink } from '@/types';
import documentsRaw from '../../data/documents.json';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

const getExcerpts = (system: System, discussion: any) => {
  return discussion.excerpts && discussion.excerpts.map((excerpt: any, index: number) => (
    excerpt.system === system.id ? <p key={index} className="text-xs ml-4 pl-2 py-1 my-1 mr-6 border-l">{excerpt.text}</p> : null
  ))
}

// get the documents as Document[]
const documents = documentsRaw as Document[];




export function ThesesLinks({ system }: { system: System }) {
  const systemTheses = documents.filter((document: Document): document is ThesesLink =>
    document.systems && document.systems.includes(system.id) && document.type === 'theses_link'
  );
  if (!systemTheses || systemTheses.length === 0) return null;
  return (
    <div id="theses-links" className='ml-1'>
      <span className="text-xs">Theses:</span>
      <ul className='list-outside'>{systemTheses.map((thesis, index) => (
        <li key={`thesis-${index}`} className='text-xs mx-4 list-["-_"]'>
          {thesis.author} <a href={thesis.url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100">
            {thesis.title}
          </a> ({thesis.date.split('-')[0]})
        </li>
      ))}
      </ul>
    </div>
  )
}


export function Discussions({ system }: { system: System }) {
  const systemDiscussions = documents.filter((document: Document): document is Discussion => 
    document.systems && document.systems.includes(system.id) && document.type === 'discussion'
  );
  if (!systemDiscussions || systemDiscussions.length === 0) return null;





  return (
    <div id="discussion" className='ml-1'>
      <span className="text-xs">Discussions:</span>
      <ul className='list-outside'>{systemDiscussions.map((discussion, index) => (
        <li key={index} className='space-x-1 text-xs mx-4 list-["-_"]'>
          {discussion.author && `${discussion.author} `}
          {discussion.author && discussion.platform && `on `}
          {discussion.platform && <strong>{discussion.platform}</strong>}
          {discussion.platform && platform_icons[discussion.platform] ? (
            <img src={platform_icons[discussion.platform]} alt={`${discussion.platform} icon`} className="inline h-4 w-4 mx-1" />
          ) : null}
          
          <a href={discussion.url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100">
            {discussion.title}
          </a> ({discussion.date.split('-')[0]})
          {getExcerpts(system, discussion)}
        </li>
      ))}
      </ul>
    </div>
  )
}



export function MicroPostsLinks({ system }: { system: System }) {
    const systemMicroPosts = documents.filter((document: Document): document is MicroPost =>
      document.systems && document.systems.includes(system.id) && document.type === 'micro_post'
    );
    if (!systemMicroPosts || systemMicroPosts.length === 0) return null;


  const getAuthorLine = (microPost: MicroPost) => (
    <div className='text-gray-500'>
      <a href={microPost.url.split('/status')[0]}
        target="_blank" rel="noopener noreferrer"
        className="font-bold text-black hover:bg-blue-100">{microPost.author}
      </a>
      <span> {microPost.author_label && (<span>{microPost.author_label}</span>)} on </span>
      <a href={microPost.url}
        target="_blank" rel="noopener noreferrer"
        className="hover:bg-blue-100">
        {microPost.date}
      </a>
    </div>
  )

  const getTextContent = (microPost: MicroPost) => {
    // Create a paragraph element using JSX
    const textWithLinks = microPost.text
      .replace(/(https?):\/\/[^\s/$.?#].[^\s]*/gi, (url) => {
        const displayUrl = url.split('//')[1];
        return `<a href="${url}" class="underline hover:bg-blue-100">${displayUrl}</a>`;
      })
      // Then replace @handles with links if needed
      .replace(/@(\w+)/g, '<a href="https://twitter.com/$1" class="underline hover:bg-blue-100">@$1</a>')
      // Respect newlines in the original text
      .replace(/\n\n/g, '<br /><br />');

    // Return the paragraph with the replaced content
    return <p className="ml-4 mt-1" dangerouslySetInnerHTML={{ __html: textWithLinks }} />;
  }
  return (
    <div id="micro-posts-links" className='ml-1'>
      <ul className='list-outside'>{systemMicroPosts.map((microPost, index) => (
        <li key={`micro-post-${index}`} className='p-1 w-full sm:w-3/4'>
          <Card className='shadow-md'>
            <CardHeader className='p-3'>
          {getAuthorLine(microPost)}
            </CardHeader>
            <CardContent>
          {getTextContent(microPost)}
          </CardContent>
          </Card>
        </li>
      ))}
      </ul>
    </div>
  )
}
