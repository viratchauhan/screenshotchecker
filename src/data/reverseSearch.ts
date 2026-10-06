export const REVERSE_PROVIDERS = [
  { name: 'Google Lens', url: 'https://www.google.com/', useCase: 'Explore matching pages, objects and similar images.', instruction: 'Select the camera icon for Search by image, then upload your saved copy.', help: 'https://support.google.com/websearch/answer/1325808?hl=en' },
  { name: 'TinEye', url: 'https://tineye.com/', useCase: 'Look for copies of the same image, including altered versions.', instruction: 'Use the upload control to search for matches to your saved image.', help: 'https://tineye.com/how' },
  { name: 'Bing Images', url: 'https://www.bing.com/images', useCase: 'Explore matching pages, related pictures and products.', instruction: 'Select the camera icon for Visual Search, then upload or paste your image.', help: 'https://support.microsoft.com/en-US/bing/using-bing-visual-search' },
];
export const REVERSE_FAQS = [
  ['How do I find the original image from a screenshot?', 'Keep the original screenshot, then search a separate copy of the picture inside it with Google Lens, TinEye or Bing. Open matching pages and compare their dates, captions and credits. An earlier match can help trace a source, but the oldest indexed result is not necessarily the original publication.'],
  ['Which reverse image search should I use?', 'TinEye focuses on copies of the same image, including some cropped or edited versions. Google Lens and Bing can also return similar images and related objects. Try more than one provider and check the source pages; none can guarantee a match.'],
  ['Is this reverse image search tool free?', 'Preparing, copying and downloading an image here is free and needs no account. Search results are provided by external services, which have their own terms, availability and limits.'],
  ['How do I reverse image search on a phone?', 'Choose a photo here and download the prepared PNG. Open a search provider below and choose that saved image using its upload control. If your browser supports file sharing, you can also send the copy to an app you choose.'],
  ['Can I reverse search a screenshot?', 'Yes. A screenshot may match an indexed photo or page, but borders, text overlays and app controls can affect results. Try the original image if available. A match does not prove that a conversation or payment happened.'],
  ['Do no results mean the image is fake or AI-generated?', 'No. An original, private, recent or unindexed photo can return no matches. Reverse search is not an AI detector or authenticity test.'],
  ['Does the oldest result prove the original source?', 'No. A search engine may not have indexed the first publication. Compare pages, dates and context, and contact the publisher when attribution matters.'],
  ['Where does my image go?', 'Selection and PNG preparation happen locally. Opening a provider link does not send your image. Uploading or pasting there, or sharing to an app, gives that service the image under its own policies.'],
];
