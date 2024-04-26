// SystemCard.tsx
import React from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from '../ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"

import { DiscordLogoIcon, GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon, ExclamationTriangleIcon, InfoCircledIcon, Link2Icon, CopyIcon, DownloadIcon, CheckIcon } from '@radix-ui/react-icons';
import CIcon from '@coreui/icons-react';
import { cibWikipedia, cibYoutube, cibMatrix, cibReddit, cibMastodon, cibFacebook } from '@coreui/icons';

import { useAppContext } from '../../contexts/AppContext';
import { System } from "../../types/system";
import { DeleteSystemButton, DisableSystemButton } from './SystemsButtons';
import SetupCustomDefaultSystemInstructions from '../cards/SetupCustomDefaultSystemInstructions';
import Discussions from './Discussions';
import { MicroPost } from '../../types/system';
import { useSystemsContext } from '../../contexts/SystemsContext';
import { LandingPageScreenshots, SpecialFeatureImage } from './ImageInserts';


type PlatformIcons = {
  [key: string]: string;
};

const platform_icons: PlatformIcons = {
  "Hacker News": "https://news.ycombinator.com/favicon.ico"
};

const HuggingFaceIcon: React.FC<{ className: string, style: React.CSSProperties }> = ({ className, style }) => {
  return (
    <svg className={className} viewBox="0 0 500 463" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M496.592 369.699C500.563 381.093 499.61 393.227 494.315 403.778C490.503 411.48 485.05 417.441 478.379 422.769C470.331 429.099 460.324 434.48 448.253 439.65C433.852 445.77 416.274 451.52 408.226 453.63C387.63 458.958 367.829 462.334 347.762 462.493C319.066 462.756 294.34 456.004 276.762 438.753C267.656 439.861 258.443 440.494 249.178 440.494C240.389 440.494 231.706 439.967 223.076 438.912C205.445 456.057 180.825 462.756 152.234 462.493C132.168 462.334 112.366 458.958 91.7177 453.63C83.7229 451.52 66.145 445.77 51.7439 439.65C39.6723 434.48 29.6656 429.099 21.6708 422.769C14.9467 417.441 9.49334 411.48 5.68127 403.778C0.439661 393.227 -0.566304 381.093 3.45755 369.699C-0.248631 360.994 -1.20165 351.024 1.71035 339.998C3.03399 334.987 5.20476 330.344 7.95792 326.229C7.37552 324.067 6.89901 321.851 6.58134 319.424C4.56941 304.97 9.59923 291.781 19.0765 281.547C23.7357 276.43 28.7655 272.895 34.0071 270.627C30.1421 254.273 28.1302 237.445 28.1302 220.247C28.1302 98.5969 127.085 0 249.178 0C291.111 0 330.343 11.6058 363.805 31.8633C369.84 35.5561 375.77 39.5126 381.436 43.7329C384.242 45.8431 387.048 48.006 389.748 50.2744C392.501 52.49 395.201 54.8112 397.796 57.1851C405.632 64.3069 412.991 71.9562 419.715 80.133C421.992 82.8235 424.163 85.6194 426.28 88.4681C430.569 94.1128 434.54 99.9685 438.193 106.035C443.752 115.109 448.623 124.604 452.859 134.469C455.665 141.064 458.101 147.816 460.271 154.727C463.501 165.067 465.99 175.723 467.684 186.696C468.213 190.336 468.69 194.028 469.06 197.721C469.802 205.107 470.225 212.598 470.225 220.247C470.225 237.234 468.213 253.904 464.454 269.994C470.278 272.262 475.784 275.955 480.92 281.547C490.397 291.781 495.427 305.022 493.415 319.477C493.098 321.851 492.621 324.067 492.039 326.229C494.792 330.344 496.963 334.987 498.286 339.998C501.198 351.024 500.245 360.994 496.592 369.699Z" fill="white" />
    <path d="M433.839 221.75C433.839 120.838 351.531 39.0323 250 39.0323C148.469 39.0323 66.1613 120.838 66.1613 221.75C66.1613 322.662 148.469 404.468 250 404.468C351.531 404.468 433.839 322.662 433.839 221.75ZM45 221.75C45 109.222 136.782 18 250 18C363.218 18 455 109.222 455 221.75C455 334.278 363.218 425.5 250 425.5C136.782 425.5 45 334.278 45 221.75Z" fill="black" />
    <path d="M250 405.5C352.173 405.5 435 323.232 435 221.75C435 120.268 352.173 38 250 38C147.827 38 65 120.268 65 221.75C65 323.232 147.827 405.5 250 405.5Z" fill="white" />
    <path d="M202.198 404.174C216.789 383.118 215.755 367.316 195.735 347.627C175.715 327.943 164.062 299.145 164.062 299.145C164.062 299.145 159.709 282.419 149.794 283.958C139.88 285.497 132.6 310.492 153.368 325.783C174.135 341.069 149.232 351.456 141.242 337.099C133.252 322.741 111.435 285.831 100.121 278.772C88.8117 271.713 80.8483 275.668 83.5151 290.218C86.182 304.769 133.48 340.036 128.878 347.668C124.276 355.296 108.058 338.7 108.058 338.7C108.058 338.7 57.3079 293.255 46.2587 305.097C35.2096 316.94 54.641 326.863 82.3328 343.359C110.03 359.85 112.177 364.206 108.248 370.446C104.314 376.685 43.1836 325.971 37.4417 347.47C31.705 368.969 99.8291 375.209 95.6247 390.051C91.4203 404.899 47.6372 361.958 38.6823 378.689C29.7221 395.425 100.465 415.088 101.038 415.234C123.889 421.067 181.924 433.426 202.198 404.174Z" fill="white" />
    <path d="M90.9935 255C82.4744 255 74.8603 258.477 69.551 264.784C66.2675 268.69 62.8367 274.986 62.5578 284.414C58.985 283.394 55.5489 282.824 52.3391 282.824C44.183 282.824 36.8163 285.93 31.6069 291.573C24.9137 298.815 21.9407 307.715 23.2351 316.62C23.8508 320.861 25.2768 324.663 27.4079 328.182C22.9142 331.795 19.6044 336.826 18.0047 342.876C16.7524 347.619 15.4685 357.497 22.1722 367.673C21.746 368.337 21.3461 369.027 20.9725 369.733C16.9418 377.336 16.684 385.927 20.2411 393.928C25.6346 406.054 39.0368 415.608 65.0625 425.863C81.2536 432.242 96.0661 436.321 96.1976 436.357C117.603 441.874 136.962 444.677 153.721 444.677C184.525 444.677 206.578 435.301 219.27 416.811C239.697 387.036 236.776 359.803 210.346 333.552C195.717 319.026 185.993 297.607 183.967 292.906C179.884 278.986 169.086 263.513 151.138 263.513H151.133C149.622 263.513 148.096 263.633 146.592 263.869C138.73 265.097 131.858 269.595 126.949 276.361C121.65 269.814 116.504 264.606 111.847 261.667C104.827 257.243 97.813 255 90.9935 255ZM90.9935 275.917C93.6771 275.917 96.9553 277.051 100.57 279.331C111.794 286.406 133.452 323.403 141.382 337.793C144.039 342.614 148.581 344.654 152.669 344.654C160.783 344.654 167.118 336.638 153.411 326.451C132.8 311.124 140.03 286.072 149.87 284.529C150.301 284.461 150.727 284.43 151.138 284.43C160.083 284.43 164.03 299.751 164.03 299.751C164.03 299.751 175.595 328.616 195.465 348.346C215.334 368.08 216.36 383.919 201.879 405.024C192.002 419.415 173.096 421.292 153.721 421.292C133.626 421.292 112.99 417.772 101.445 414.796C100.877 414.65 30.7019 396.255 39.5946 379.48C41.089 376.661 43.5516 375.532 46.6509 375.532C59.1744 375.532 81.9535 394.054 91.746 394.054C93.935 394.054 95.5662 392.371 96.1976 390.112C100.555 374.522 32.6646 369.738 38.3633 348.189C39.3683 344.377 42.094 342.829 45.9248 342.834C62.4737 342.834 99.6021 371.756 107.385 371.756C107.979 371.756 108.405 371.584 108.637 371.218C112.536 364.964 110.74 359.872 83.257 343.343C55.7738 326.808 36.1428 317.588 47.114 305.718C48.3768 304.347 50.1659 303.741 52.3391 303.741C69.0248 303.746 108.447 339.398 108.447 339.398C108.447 339.398 119.087 350.395 125.523 350.395C127.001 350.395 128.259 349.815 129.111 348.382C133.673 340.737 86.7366 305.388 84.0898 290.804C82.2955 280.921 85.3474 275.917 90.9935 275.917Z" fill="black" />
    <path d="M296.9 404.174C282.31 383.118 283.343 367.316 303.363 347.627C323.383 327.943 335.037 299.145 335.037 299.145C335.037 299.145 339.39 282.419 349.304 283.958C359.219 285.497 366.498 310.492 345.731 325.783C324.963 341.069 349.866 351.456 357.856 337.099C365.846 322.741 387.663 285.831 398.978 278.772C410.287 271.713 418.25 275.668 415.583 290.218C412.916 304.769 365.618 340.036 370.22 347.668C374.822 355.296 391.041 338.7 391.041 338.7C391.041 338.7 441.791 293.255 452.84 305.097C463.889 316.94 444.457 326.863 416.766 343.359C389.068 359.85 386.921 364.206 390.85 370.446C394.784 376.685 455.915 325.971 461.657 347.47C467.393 368.969 399.269 375.209 403.474 390.051C407.678 404.899 451.461 361.958 460.416 378.689C469.376 395.425 398.633 415.088 398.06 415.234C375.209 421.067 317.175 433.426 296.9 404.174Z" fill="white" />
    <path d="M408.105 255C416.624 255 424.238 258.477 429.547 264.784C432.831 268.69 436.262 274.986 436.541 284.414C440.113 283.394 443.549 282.824 446.759 282.824C454.915 282.824 462.282 285.93 467.491 291.573C474.185 298.815 477.158 307.715 475.863 316.62C475.248 320.861 473.822 324.663 471.69 328.182C476.184 331.795 479.494 336.826 481.094 342.876C482.346 347.619 483.63 357.497 476.926 367.673C477.352 368.337 477.752 369.027 478.126 369.733C482.157 377.336 482.414 385.927 478.857 393.928C473.464 406.054 460.062 415.608 434.036 425.863C417.845 432.242 403.032 436.321 402.901 436.357C381.495 441.874 362.136 444.677 345.377 444.677C314.573 444.677 292.52 435.301 279.829 416.811C259.402 387.036 262.322 359.803 288.753 333.552C303.381 319.026 313.105 297.607 315.131 292.906C319.214 278.986 330.012 263.513 347.961 263.513H347.966C349.476 263.513 351.002 263.633 352.507 263.869C360.368 265.097 367.24 269.595 372.15 276.361C377.449 269.814 382.595 264.606 387.252 261.667C394.271 257.243 401.285 255 408.105 255ZM408.105 275.917C405.421 275.917 402.143 277.051 398.528 279.331C387.304 286.406 365.646 323.403 357.716 337.793C355.059 342.614 350.518 344.654 346.429 344.654C338.315 344.654 331.98 336.638 345.687 326.451C366.299 311.124 359.069 286.072 349.229 284.529C348.797 284.461 348.371 284.43 347.961 284.43C339.015 284.43 335.069 299.751 335.069 299.751C335.069 299.751 323.503 328.616 303.634 348.346C283.764 368.08 282.738 383.919 297.219 405.024C307.096 419.415 326.002 421.292 345.377 421.292C365.472 421.292 386.108 417.772 397.653 414.796C398.221 414.65 468.397 396.255 459.504 379.48C458.009 376.661 455.547 375.532 452.447 375.532C439.924 375.532 417.145 394.054 407.352 394.054C405.163 394.054 403.532 392.371 402.901 390.112C398.543 374.522 466.434 369.738 460.735 348.189C459.73 344.377 457.004 342.829 453.174 342.834C436.625 342.834 399.496 371.756 391.714 371.756C391.119 371.756 390.693 371.584 390.461 371.218C386.562 364.964 388.358 359.872 415.841 343.343C443.325 326.808 462.956 317.588 451.984 305.718C450.722 304.347 448.932 303.741 446.759 303.741C430.074 303.746 390.651 339.398 390.651 339.398C390.651 339.398 380.011 350.395 373.576 350.395C372.097 350.395 370.84 349.815 369.987 348.382C365.425 340.737 412.362 305.388 415.009 290.804C416.803 280.921 413.751 275.917 408.105 275.917Z" fill="black" />
    <path d="M319.277 228.901C319.277 205.236 288.585 241.304 250.637 241.465C212.692 241.306 182 205.238 182 228.901C182 244.591 189.507 270.109 209.669 285.591C213.681 271.787 235.726 260.729 238.877 262.317C243.364 264.578 243.112 270.844 250.637 276.365C258.163 270.844 257.911 264.58 262.398 262.317C265.551 260.729 287.594 271.787 291.605 285.591C311.767 270.109 319.275 244.591 319.275 228.903L319.277 228.901Z" fill="#0E1116" />
    <path d="M262.4 262.315C257.913 264.576 258.165 270.842 250.639 276.363C243.114 270.842 243.366 264.578 238.879 262.315C235.726 260.727 213.683 271.785 209.672 285.589C219.866 293.417 233.297 298.678 250.627 298.806C250.631 298.806 250.635 298.806 250.641 298.806C250.646 298.806 250.65 298.806 250.656 298.806C267.986 298.68 281.417 293.417 291.611 285.589C287.6 271.785 265.555 260.727 262.404 262.315H262.4Z" fill="#FF323D" />
    <path d="M373 196C382.389 196 390 188.389 390 179C390 169.611 382.389 162 373 162C363.611 162 356 169.611 356 179C356 188.389 363.611 196 373 196Z" fill="black" />
    <path d="M128 196C137.389 196 145 188.389 145 179C145 169.611 137.389 162 128 162C118.611 162 111 169.611 111 179C111 188.389 118.611 196 128 196Z" fill="black" />
    <path d="M313.06 171.596C319.796 173.968 322.476 187.779 329.281 184.171C342.167 177.337 347.06 161.377 340.208 148.524C333.356 135.671 317.354 130.792 304.467 137.626C291.58 144.46 286.688 160.419 293.54 173.272C296.774 179.339 307.039 169.475 313.06 171.596Z" fill="#0E1116" />
    <path d="M188.554 171.596C181.818 173.968 179.138 187.779 172.334 184.171C159.447 177.337 154.555 161.377 161.407 148.524C168.259 135.671 184.26 130.792 197.147 137.626C210.034 144.46 214.926 160.419 208.074 173.272C204.84 179.339 194.575 169.475 188.554 171.596Z" fill="#0E1116" />
  </svg>
  )
}

const alertClass = "mt-1 w-full mx-auto flex flex-col"

const NoticeAlert: React.FC<SystemCardProps> = ({ system }) => {
  return (
    <Alert className={alertClass}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Notice</AlertTitle>
      <AlertDescription className="flex flex-col">
        {system.accountRequired && <><span className="text-red-500">Account Required</span><br></br></>}
        {system.mobileAppBreaksLinksWarning && (<>
          <span className="text-red-500">Warning: Links may not work in mobile app</span><br></br></>)}
        {system.manualSwitchRequired && (<><span className="text-red-500">Web Search requires toggling a switch manually.</span><br></br></>)}
      </AlertDescription>
    </Alert>
  )
}

const SearchLinkPatternAlert: React.FC<SystemCardProps> = ({ system }) => {
  const searchLinkPatternFormattedGithubIssueLink = 'https://github.com/archignes/searchjunct/issues/new' +
    [`?title=${ encodeURIComponent('Update searchLink for URL-driven search support for ' + system.name + ' (' + system.id + ')')}`,
    `&body=${encodeURIComponent('# Add Search Link Pattern\n\nThe searchLink pattern for ' + system.name + ' is: {}\n\n')}`,
    `${encodeURIComponent('# Guidance\n\nBe sure to include the `%s` placeholder for the query string.\n\n')}`,
    `${encodeURIComponent('Please provide links to documentation, if available.\n\n')}`,
    `${encodeURIComponent('Please indicate if the system requires query terms to be joined by `%20`, rather than `+` ')}`,
    `${encodeURIComponent('(this will be needed in the searchLink_joiner field for the system because Searchjunct uses the plus as a default for readability).\n\n')}`,
    `${encodeURIComponent('Thank you!')}`].join('');

return (
  <Alert className={alertClass}>
    <ExclamationTriangleIcon className="h-4 w-4" />
    <AlertTitle>Search Link Pattern Notice</AlertTitle>
    <AlertDescription>
      <span>URL-driven searches are <span className="text-red-500 font-bold">not</span> supported.
        If given permissions, Searchjunct will copy the query to your clipboard.</span>
      <p className="text-right">
        <a href={searchLinkPatternFormattedGithubIssueLink} target="_blank" rel="noopener noreferrer"
          className="text-xs mt-2 underline hover:bg-blue-100 p-1 rounded-md">Add Search Link Pattern</a></p>
    </AlertDescription>
  </Alert>
)
}

const ThesesLinks: React.FC<SystemCardProps> = ({ system }) => {
  if (!system.thesesLinks) return null;
  return (
    <div id="theses-links" className='ml-1'>
      <span className="text-xs">Theses:</span>
      <ul className='list-outside'>{system.thesesLinks.map((thesis, index) => (
        <li key={index} className='text-xs mx-4 list-["-_"]'>
          {thesis.author} <a href={thesis.url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100">
                {thesis.title}
            </a> ({thesis.date.split('-')[0]})
        </li>
      ))}
      </ul>
    </div>
  )
}


const MicroPostsLinks: React.FC<SystemCardProps> = ({ system }) => {
  console.log(system)
  if (!system.microPosts) return null;

  const getAuthorLine = (microPost: MicroPost) => (
          <>
          <a href={microPost.url.split('/status')[0]}
             target="_blank" rel="noopener noreferrer"
             className="font-bold hover:bg-blue-100">{microPost.author}
          </a>
          <span> {microPost.author_label && (<span>{microPost.author_label}</span>)} on </span>
          <a href={microPost.url}
             target="_blank" rel="noopener noreferrer"
             className="hover:bg-blue-100">
            {microPost.date}
          </a>
          </>)

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
    return <p className="ml-2 mt-1" dangerouslySetInnerHTML={{ __html: textWithLinks }} />;
  }
  return (
    <div id="micro-posts-links" className='ml-1'>
      <ul className='list-outside'>{system.microPosts.map((microPost, index) => (
        <li key={index} className='text-sm urlx-4 border rounded-md p-1 w-full sm:w-1/2'>
          {getAuthorLine(microPost)}
          {getTextContent(microPost)}
        </li>
      ))}
      </ul>
    </div>
  )
}

const SpecialFeatures: React.FC<SystemCardProps> = ({ system }) => {
  if (!system.specialFeatures) return null;
  return (
    <div id="special-features" className='ml-1 border-t pt-2'>
      <span className="text-sm font-bold">Special Features</span>
        <ul>{system.specialFeatures.map((feature, index) => (
        <li key={feature.type.replace(/ /g, '-')} className='text-sm mx-4'>
            <span className="font-bold">{feature.type}: </span>
          <a href={feature.url} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100">{feature.title}</a>
            <br></br>
            {feature.description && <span>{feature.description}</span>}
            {feature.image && <SpecialFeatureImage image={feature.image} title={feature.title} />}
        </li>
      ))}
      </ul>
    </div>
  )
}



const PermalinkAlertDialog: React.FC<SystemCardProps> = ({ system }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="m-0 mr-0 p-1 text-xs rounded-md hover:bg-blue-100 focus:outline-none flex items-center justify-center"
          onClick={() => { navigator.clipboard.writeText(`${ window.location.origin }/?systems=${ system.id }`); }}
        >
          <CopyIcon className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Copied system permalink to clipboard!</AlertDialogTitle>
          <AlertDialogDescription>
            You can use this link to return to this system card.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Dismiss</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const SearchLinkAlertDialog: React.FC<SystemCardProps> = ({ system }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="flex flex-row items-center text-xs justify-center p-0 m-0">
        <Button variant="ghost" size="sm"
          className="m-0 p-0 hover:bg-white font-normal flex-row items-center justify-center"
        >
          <div className="grid grid-cols-[auto_24px] hover:bg-blue-100 text-left p-1 items-center justify-center rounded-md underline">
            <span className="overflow-auto max-w-full">{system.searchLink}</span>
            <CopyIcon className="ml-1 h-4 w-4" />
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='w-90% mx-auto'>
        <AlertDialogHeader className='w-90% mx-auto'>
          <AlertDialogTitle>Copied search link to clipboard!</AlertDialogTitle>
          <AlertDialogDescription className='text-left w-90% mx-auto'>
            {system.searchLink.includes('%s') ? (
              <>
                <SetupCustomDefaultSystemInstructions system={system} />
              </>
            ) : (<p>Search link does not contain a <code>%s</code> placeholder so you cannot set this system as your default search engine or dynamically create search links.</p>)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Dismiss</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface SystemCardProps {
  system: System;
}

const SystemCard: React.FC<SystemCardProps> = ({ system }) => {
  const { settingsCardActive } = useAppContext();
  const {allSystems} = useSystemsContext();

  return (<>
    <Card id={`system-card-${system.id}`} className="border-none shadow-none mt-0 p-2 pt-0 px-1 mx-1">
      <CardContent className="px-1 pb-2 grid grid-cols-1 gap-0">
          {system.tagline && (
            <div className="text-sm text-gray-600 text-center w-2/5 mx-auto italic my-2">
              {system.tagline}
            </div>
          )}
          <div className="flex flex-wrap items-center">
            <div className="flex flex-wrap break-words m-0 p-0 text-xs">
            <a href={`${window.location.origin}/?systems=${system.id}`} className="hover:bg-blue-100 rounded-md flex items-center justify-center flex break-words p-1">
                <code className="mr-1 break-all">{system.id}</code>
                <Link2Icon className="inline h-4 w-4" />
              </a>
              <PermalinkAlertDialog system={system} />
            </div>
          </div>
        <div className="flex flex-wrap break-words m-0 p-0 text-xs">
            <SearchLinkAlertDialog system={system} />
          </div>
        {system.searchLinkNote && (
          <div className="w-90 flex border rounded-md m-1 p-1 flex-wrap items-center">
            <p className="text-xs">Note: {system.searchLinkNote}</p>
          </div>
        )}
        {system.aboutLink && <div className="flex flex-row flex-grow gap-x-1 justify-left items-center ml-1 text-xs">
          About:<a href={system.aboutLink.url} target="_blank" rel="noopener noreferrer" className="hover:bg-blue-100 underline p-1 block">{system.aboutLink.title}</a>
        </div>}
        {system.pronunciation && <div className="flex flex-row flex-grow gap-x-1 ml-1 justify-left items-center text-xs">
          Pronunciation:<a href={system.pronunciation.url} target="_blank" rel="noopener noreferrer" className="block hover:bg-blue-100 underline p-1">{system.pronunciation.string}</a>
        </div>}
        {system.namingNote && <div className="flex flex-row flex-grow gap-x-1 ml-1 justify-left items-center text-xs">
          Naming Note: {system.namingNote}
        </div>}
        {system.seeAlso && <div className="flex flex-row flex-grow gap-x-1 ml-1 justify-left items-center text-xs">
          See: {system.seeAlso.map((relatedSystemId, index, array) => {
          const relatedSystem = allSystems.find((sys) => sys.id === relatedSystemId);
          return relatedSystem ? (
            <>
              <a href={`${window.location.origin}/?systems=${relatedSystem.id}`}
                 className="hover:bg-blue-100 rounded-md underline p-1 block">
                {relatedSystem.name}
              </a>
              {index < array.length - 1 && <span className="mx-1">|</span>}
            </>
          ) : null;
        })}
        </div>}
        {(system.openSourceLicense && system.githubLink) && (
          <div className="flex flex-wrap items-center">
            <span className="text-xs ml-1">Open Source?<CheckIcon className="h-5 w-5 pb-1 m-0 inline align-middle" /></span>
            <a href={system.githubLink} className="mx-auto sm:mx-0">
              <Button
                className="m-0 max-h-6 underline ml-0 pl-0 pb-1 hover:bg-blue-100 rounded-me font-normal justify-start text-left"
                variant="ghost"
                size="sm"
              >
                {system.openSourceLicense}
              </Button>
            </a>
          </div>
        )}
        {(system.githubSponsorLink) && (
          <div className="flex flex-wrap justify-center items-center">
            <Button
              className="m-0 max-h-6 ml-0 pl-0 hover:bg-blue-100 rounded-me font-normal justify-start text-left"
              variant="outline"
              size="sm"
            >
              <a href={system.githubSponsorLink} target="_blank" rel="noopener noreferrer" className="">
                <GitHubLogoIcon className="inline ml-2" /> Become a sponsor to {system.name}
            </a>
          </Button>
          </div>
        )}
        {(system.charitySearchEngine) && (
          <div className="flex flex-wrap items-center ml-4">
            <span className="text-xs bg-green-300 p-1 rounded-md mb-1">charity search engine</span>
          </div>
        )}
        
        <ThesesLinks system={system} />
        <MicroPostsLinks system={system} />
        <Discussions system={system} />
        {(system.manualSwitchRequired || system.mobileAppBreaksLinksWarning || system.accountRequired) && (
          <NoticeAlert system={system} />
        )}
        {!system.searchLink.includes('%s') && (
          <SearchLinkPatternAlert system={system} />
        )}
        {(system.androidChoiceScreenOptions || system.defaultInBrowser) && (
          <Alert id="android-choice-screen-options" className="mt-1">
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle>Did you know?</AlertTitle>
            <AlertDescription>
              <div className="hover:bg-blue-100 rounded-md p-1">
                {system.androidChoiceScreenOptions && (<><span >This system is included in the <a className="underline" href="https://www.android.com/choicescreen-winners/" target="_blank" rel="noopener noreferrer">Android Choice Screen Options for September 2023 - August 2024</a>.</span></>)}
                {system.defaultInBrowser && <p className="mt-1">This system is included in the default search engine options for the following web browsers: {system.defaultInBrowser.join(', ')}.</p>}
              </div>
            </AlertDescription>
          </Alert>
        )}
        <LandingPageScreenshots system={system} />
      {!settingsCardActive && (
        <div className="flex flex-col space-x-1 text-xs sm:space-y-0 sm:space-x-2 w-2/5 my-2 items-end justify-end ml-auto">
          <DisableSystemButton system={system} />
          <DeleteSystemButton system={system} />
        </div>
      )}
      <CardDescription>
      </CardDescription>
        <SpecialFeatures system={system} />
      {(system.androidApp || system.iosApp || system.chromeExtension || system.safariExtension) && (
      <>
          <Alert>
            <DownloadIcon className="h-4 w-4" />
            <AlertTitle>Download & Install</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col space-y-2">
                {(system.chromeExtension || system.safariExtension) && (
                <>
                    <span className="text-xs">Browser: </span>
                    <ul className="pl-3 text-xs">
                    {system.chromeExtension && (
                    <li className="m-0 pt-0">
                    <a href={system.chromeExtension} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    Chrome Extension
                    </a>
                    </li>
                    )}
                    {
                    system.safariExtension && (
                    <li className="m-0 pt-0">
                    <a href={system.safariExtension} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    Safari Extension
                    </a>
                    </li>
                    )}
                    </ul>
                    </>
                    )}
                    {(system.androidApp || system.iosApp) && (<>
                    <span className="text-xs">Mobile:</span>
                    <ul className="pl-3 text-xs">
                    {system.iosApp && (
                    <li className="m-0 pt-0">
                    <a href={system.iosApp} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    iOS App
                    </a>
                    </li>
                    )}
                    {system.androidApp && (
                    <li className="m-0 pt-0">
                    <a href={system.androidApp} target="_blank" rel="noopener noreferrer" className="underline hover:bg-blue-100 p-1 rounded-md">
                    Android App
                    </a>
                    </li>
                    )}
                    </ul>
                    </>)}
                    </div>
                    </AlertDescription>
                    </Alert>
            <div className="mt-1"></div>
            </>
                    
                    )}
              </CardContent>
              <CardFooter id="system-card-footer" data-testid="system-card-footer" className="pb-1">
                <div className="border-t pt-1 flex flex-col items-center w-full">
                <div className="flex flex-row flex-grow space-x-1 justify-center items-center">
                  {system.wikipediaLink && <a href={system.wikipediaLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibWikipedia} className="w-4 h-4" /></a>}
                    {system.twitterLink && <a href={system.twitterLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><TwitterLogoIcon /></a>}
                    {system.githubLink && <a href={system.githubLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><GitHubLogoIcon /></a>}
                    {system.instagramLink && <a href={system.instagramLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><InstagramLogoIcon /></a>}                   
                    {system.matrixLink && <a href={system.matrixLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibMatrix} className="w-4 h-4" /></a>}
                    {system.discordLink && <a href={system.discordLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><DiscordLogoIcon/></a>}
                    {system.hackerNewsLink && (
                      <a href={system.hackerNewsLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-gray-100 rounded-md block">
                        <img src={platform_icons["Hacker News"]} alt="Hacker News Icon" className="w-4 h-4" style={{filter: "grayscale(1) contrast(100) brightness(1)"}} />
                      </a>
                    )}
                    {system.mastodonLink && <a href={system.mastodonLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibMastodon} className="w-4 h-4" /></a>}
                    {system.facebookLink && <a href={system.facebookLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibFacebook} className="w-4 h-4" /></a>}
            {system.huggingFaceLink && <a href={system.huggingFaceLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><HuggingFaceIcon className="w-4 h-4" style={{ filter: "grayscale(100%)"}} /></a>}
                    {system.redditLink && <a href={system.redditLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibReddit} className="w-4 h-4" /></a>}
                    {system.linkedinLink && <a href={system.linkedinLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><LinkedInLogoIcon/></a>}
                    {system.youtubeLink && <a href={system.youtubeLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block"><CIcon icon={cibYoutube} className='w-4 h-4'/></a>}
            {system.productHuntLink && <a href={system.productHuntLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:bg-blue-100 rounded-md block">
                      <svg height="18px" id="Layer_1" version="1.1" viewBox="0 0 56.7 56.7" width="18px" xmlns="http://www.w3.org/2000/svg"><g><g><path d="M28.35,3.5943c-13.6721,0-24.7556,11.0835-24.7556,24.7556c0,13.6722,11.0835,24.7557,24.7556,24.7557    c13.6722,0,24.7556-11.0835,24.7556-24.7557C53.1056,14.6778,42.0222,3.5943,28.35,3.5943z M31.6508,33.3011L31.6508,33.3011    l-7.0141,0.0001v7.4266h-4.9511V15.9721l11.9653,0.0001v-0.0001c4.7853,0,8.6644,3.8793,8.6644,8.6645    C40.3152,29.4219,36.4361,33.3011,31.6508,33.3011z" /></g><g><path d="M31.6508,20.9233L31.6508,20.9233l-7.0141,0.0001V28.35h7.0141v-0.0001c2.0508,0,3.7132-1.6625,3.7132-3.7133    C35.364,22.5858,33.7016,20.9233,31.6508,20.9233z" /></g></g>
                      </svg></a>}
                    </div>
                  </div>
                </CardFooter>
              </Card >
  </>);
};

export default SystemCard;