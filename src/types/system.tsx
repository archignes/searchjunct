// systems.tsx

export interface MicroPost {
    date: string;
    text: string;
    url: string;
    author: string;
    author_label: string;
}

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
    microPosts?: MicroPost[];
    redditLink?: string;
    matrixLink?: string;
    githubLink?: string;
    hackerNewsLink?: string;
    mastodonLink?: string;
    facebookLink?: string;
    discordLink?: string;
    youtubeLink?: string;
    openSourceLicense?: string;
    openSourceLicenseUrl?: string;
    nonprofitVerification?: string;
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
    landingPageScreenshots?: string[];
    iosApp?: string;
    androidApp?: string;
    defaultInBrowser?: string[];
    baseUrl?: string;
    specialNote?: string;
    notableFeatures?: Feature[];
    thesesLinks?: {
        title: string;
        url: string;
        author: string;
        date: string;
    }[];
    discussions?: {
        title: string;
        date: string;
        author?: string;
        platform?: string;
        url: string;
    }[];
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
