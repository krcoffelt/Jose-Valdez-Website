import { defineDocumentType, makeSource } from "contentlayer/source-files";

const Release = defineDocumentType(() => ({
  name: "Release",
  filePathPattern: `releases/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    date: { type: "date", required: true },
    releaseType: { type: "enum", options: ["single", "ep", "album"], required: true },
    cover: { type: "string", required: true },
    platforms: { type: "json", required: false },
    tracks: { type: "json", required: true },
    credits: { type: "json", required: false },
  },
}));

const Track = defineDocumentType(() => ({
  name: "Track",
  filePathPattern: `tracks/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    release: { type: "string", required: true },
    bpm: { type: "number", required: false },
    key: { type: "string", required: false },
    isrc: { type: "string", required: false },
    isExplicit: { type: "boolean", required: false },
  },
}));

const Video = defineDocumentType(() => ({
  name: "Video",
  filePathPattern: `videos/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    slug: { type: "string", required: true },
    platform: { type: "enum", options: ["youtube", "vimeo"], required: true },
    videoId: { type: "string", required: true },
    thumbnail: { type: "string", required: false },
    category: { type: "enum", options: ["music", "worship", "content"], required: true },
  },
}));

const Update = defineDocumentType(() => ({
  name: "Update",
  filePathPattern: `updates/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Release, Track, Video, Update],
});
