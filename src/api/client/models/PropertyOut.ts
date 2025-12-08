/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PropertyImage } from './PropertyImage';
import type { UserOut } from './UserOut';
export type PropertyOut = {
    project_name: string;
    title: string;
    price: string;
    location: string;
    type: string;
    listed_type: string;
    state: string;
    district: string;
    city: string;
    neighborhood: string;
    bedrooms?: (number | null);
    bathrooms?: (number | null);
    area: string;
    description?: (string | null);
    status?: string;
    featured_image_url?: (string | null);
    amenities?: (string | null);
    id: number;
    views?: number;
    inquiries?: number;
    owner_id?: (number | null);
    created_at: string;
    updated_at: string;
    images?: Array<PropertyImage>;
    owner?: (UserOut | null);
};

