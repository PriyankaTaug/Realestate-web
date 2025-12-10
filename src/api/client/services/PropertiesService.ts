/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_property_api_properties__post } from '../models/Body_create_property_api_properties__post';
import type { PropertyOut } from '../models/PropertyOut';
import type { PropertyUpdate } from '../models/PropertyUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PropertiesService {
    /**
     * List Properties
     * @param skip
     * @param limit
     * @returns PropertyOut Successful Response
     * @throws ApiError
     */
    public static listPropertiesApiPropertiesGet(
        skip?: number,
        limit: number = 50,
    ): CancelablePromise<Array<PropertyOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/properties/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Property
     * Create a new property with images.
     * Note: FastAPI expects multiple files with the same field name 'images'.
     * @param formData
     * @returns PropertyOut Successful Response
     * @throws ApiError
     */
    public static createPropertyApiPropertiesPost(
        formData: Body_create_property_api_properties__post,
    ): CancelablePromise<PropertyOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/properties/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Property
     * @param propertyId
     * @returns PropertyOut Successful Response
     * @throws ApiError
     */
    public static getPropertyApiPropertiesPropertyIdGet(
        propertyId: number,
    ): CancelablePromise<PropertyOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/properties/{property_id}',
            path: {
                'property_id': propertyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Property
     * @param propertyId
     * @param requestBody
     * @returns PropertyOut Successful Response
     * @throws ApiError
     */
    public static updatePropertyApiPropertiesPropertyIdPut(
        propertyId: number,
        requestBody: PropertyUpdate,
    ): CancelablePromise<PropertyOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/properties/{property_id}',
            path: {
                'property_id': propertyId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Property
     * @param propertyId
     * @returns void
     * @throws ApiError
     */
    public static deletePropertyApiPropertiesPropertyIdDelete(
        propertyId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/properties/{property_id}',
            path: {
                'property_id': propertyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
