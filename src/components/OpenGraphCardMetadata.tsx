// OpenGraphCardMetaData.tsx
import { System } from '@/types';

const OpenGraphCardMetaData = (system: System) => {
    const title = `Searchjunct: ${system.name}`

    const description = `Systems card for ${system.name}`
    const domain = process.env.NEXT_PUBLIC_DOMAIN;
    const url = `${domain}/system/${system.id}`;
    const image = `${domain}/screenshots/system-${system.id}.png`;

    const ogMetadata = { title, description, url, image };

    return (ogMetadata);
};

export default OpenGraphCardMetaData;
