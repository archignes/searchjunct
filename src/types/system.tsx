// systems.tsx

export interface System {
    id: string;
    name: string;
    nondistinctUrl?: boolean;
    description?: string;
    parent?: string;
    children?: string[];
    seeAlso?: string[];
    baseUrlFor?: string[];
    accountRequired?: boolean;
    searchLink: string;
    indices?: [
        {
            name: string;
            url: string;
        }
    ]
    searchLinkJoiner?: string;
    searchLinkNote?: string;
    searchLinkRequiresQuery?: boolean;
    mobileAppBreaksLinksWarning?: boolean;
    searched?: boolean;
    linkedinLink?: string;
    huggingFaceLink?: string;
    wikipediaLink?: string;
    instagramLink?: string;
    namingNote?: string;
    twitterLink?: string;
    redditLink?: string;
    matrixLink?: string;
    githubLink?: string;
    hackerNewsLink?: string;
    mastodonLink?: string;
    facebookLink?: string;
    discordLink?: string;
    youtubeLink?: string;
    shareLinksSupported?: boolean;
    exampleSharedLinks?: [
        {
            name: string;
            url: string;
        }
    ]
    openSourceLicense?: string;
    openSourceLicenseUrl?: string;
    nonprofitVerification?: string;
    citations?: [
        {
            names: string;
            year: string;
            title: string;
            publication: string;
            doi: string;
            title_url: string;
            doi_url: string;
            abstract: string;
        }
    ]
    webSearchSystem?: boolean;
    productHuntLink?: string;
    favicon?: string;
    aboutLink?: {
        title: string;
        url: string;
    };
    disabled?: boolean;
    deleted?: boolean;
    manualSwitchRequired?: boolean;
    androidChoiceScreenOptions?: boolean;
    chromeExtension?: string;
    safariExtension?: string;
    charitySearchEngine?: boolean;
    defaultPlaceholder?: string;
    tagline?: string;
    specialFeatures?: [
        {
            type: string;
            title: string;
            description?: string;
            image?: string;
            url: string;
        }
    ]
    landingPageScreenshots?: string[];
    iosApp?: string;
    androidApp?: string;
    addFaviconBackground?: string;
    defaultInBrowser?: string[];
    type?: string;
    note?: {
        text: string;
        links: {
            placeholder: string;
            url: string;
        }[];
    };
    characteristics?: {
        output?: string;
        index?: string;
    };
    baseUrl?: string;
    specialNote?: string;
    notableFeatures?: Feature[];
    githubSponsorLink?: string;
    pronunciation?: {
        string: string;
        url: string;
    };
}

export interface Feature {
    name: string;
    url?: string;
    description?: string;
}
