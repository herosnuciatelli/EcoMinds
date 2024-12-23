import { defineQuery } from "next-sanity";

export const PROJECT_QUERY = defineQuery(`
    *[_type == "project" && defined(slug.current) && !defined($search) || title match $search || author -> name match $search | order(_createdAt desc)] {
        _id,
        title,
        slug,
        _createdAt,
        views,
        description,
        image
    }
`)

export const PROJECT_BY_ID_QUERY = defineQuery(`
    *[_type == "project" && _id == $id][0]{
        _id,
        title,
        slug,
        _createdAt,
        views,
        description,
        image,
        pitch
    }
`)

export const PROJECT_ANOTHERS_QUERY = defineQuery(`
    *[_type == "project" && defined(slug.current) && _id != $id | order(_createdAt desc)] {
        _id,
        title,
        slug,
        _createdAt,
        views,
        description,
        image
    }
`)