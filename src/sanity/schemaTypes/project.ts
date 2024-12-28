import { IconUser } from "@tabler/icons-react";
import { defineField, defineType } from "sanity";

export const project = defineType({
    name: "project",
    title: "Project",
    type: "document",
    icon: IconUser,
    fields: [
        defineField({
            name: 'title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title'
            }
        }),
        defineField({
            name: 'author',
            type: 'reference',
            to: [{ type: 'author', title: 'Author'}]
        }),
        defineField({
            name: 'views',
            type: 'number',
        }),
        defineField({
            name: 'description',
            type: 'text',
        }),
        defineField({
            name: 'image',
            type: 'url',
        }),
        defineField({
            name: 'pitch',
            type: 'markdown',
        }),
    ],
    preview: {
        select: {
            title: 'name'
        }
    }
})