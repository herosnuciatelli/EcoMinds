import { MAX_PROJECTS_PER_REQUEST } from "@/constants";
import { defineQuery } from "next-sanity";

export const PROJECT_QUERY = defineQuery(`
    *[_type == "project" && defined(slug.current) && !defined($search) || title match $search || author -> name match $search | order(_createdAt desc)][0...${MAX_PROJECTS_PER_REQUEST}] {
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
        pitch,
        project,
        video
    }
`)

export const PROJECT_OTHERS_QUERY = defineQuery(`
    *[_type == "project" && _id != $id][0...3]{
        _id,
        title,
        slug,
        _createdAt,
        views,
        description,
        image
    }
`)

export const AUTHOR_QUERY = defineQuery(`
    *[_type == "author" && user_id == $user_id][0]{
        _id
    }
`)

export const GET_MORE_PROJECTS = defineQuery(`
    *[_type == "project" && _id > $lastId && defined(slug.current) && !defined($search) || title match $search || author -> name match $search] | order(_id) [0...${MAX_PROJECTS_PER_REQUEST}] {
        _id,
        title,
        slug,
        _createdAt,
        views,
        description,
        image
    }
`)