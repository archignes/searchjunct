// systems.tsx

export interface System {
    id: string;
    name: string;
    nondistinct_url?: boolean;
    description?: string;
    base_url_for?: string[];
    account_required?: boolean;
    searchLink: string;
    searchLink_joiner?: string;
    searchLink_note?: string;
    mobile_app_breaks_links_warning?: boolean;
    searched?: boolean;
    linkedin_link?: string;
    wikipedia_link?: string;
    instagram_link?: string;
    twitter_link?: string;
    reddit_link?: string;
    matrix_link?: string;
    github_link?: string;
    hacker_news_link?: string;
    mastodon_link?: string;
    facebook_link?: string;
    discord_link?: string;
    youtube_link?: string;
    open_source_license?: string;
    open_source_license_url?: string;
    nonprofit_verification?: string;
    web_search_system?: boolean;
    product_hunt_link?: string;
    favicon?: string;
    about_link?: {
        title: string;
        url: string;
    };
    disabled?: boolean;
    deleted?: boolean;
    manual_switch_required?: boolean;
    android_choice_screen_options?: boolean;
    chrome_extension?: string;
    safari_extension?: string;
    charity_search_engine?: boolean;
    default_placeholder?: string;
    tagline?: string;
    ios_app?: string;
    android_app?: string;
    default_in_browser?: string[];
    base_url?: string;
    special_note?: string;
    searchLink_requires_query?: boolean;
    notable_features?: Feature[];
    theses_links?: {
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
    github_sponsor_link?: string;
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
