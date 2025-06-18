import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY = defineQuery(`*[
  _type == "startup" &&
  defined(slug.current) &&
  (
    !defined($search) || 
    title match $search || 
    category match $search || 
    author->name match $search
  )
]
{
   title, 
   author -> {
     _id, name, bio, image
   }, 
   _id, 
   _createdAt, 
   views,
   slug, 
   description,
   category, 
   image
}`);

export const STARTUP_BY_ID_QUERY = defineQuery(`*[
   _type == "startup" && _id == $id][0]{
   title, 
   author -> {
     _id, name, bio, image, username
   }, 
   _id, 
   _createdAt, 
   views,
   slug, 
   description,
   category, 
   image,
   pitch
}`)

export const STARTUP_VIEWS_QUERY = defineQuery(`*[
  _type == "startup" && _id == $id][0]{
   _id, views
  }
  `)