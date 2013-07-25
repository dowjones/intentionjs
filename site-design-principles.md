# Regarding the design of this site

## Design Intentions (lol)
- **The main principle** — Super, super straightforward. The visitor should be able to figure out what they're looking at without having to do anything but look. If a user has to scroll or click to understand what's being shown… Well, they won't.
- Unless the logo can *actually* describe the project in an instant, there should not be more emphasis on it than on the information. Branding for projects is not that important.
- All content should have lots of air to breath. Each article has plenty of padding. Content is easy to digest when it is free from clutter (even if that clutter is relevant). 
	- Maybe that's a good thing to note on: relevancy. I'm thinking about each `<article>` as a section of content that is *only* relevant to the article's title. In other words, if content is related to the same info group, but not this particular `<article>`, then it doesn't need to clutter the <article>
- Likewise, text should be spaced out within a body (line-height) and betweens bodies (margins and padding)
- Images (and all design for that matter) should be equally as informative and it is pretty. A decorative image to draw in visitors' attention is irrelevant and frowned upon.

## Information Organization
- Immediacy, again, is very important. 
- It's important to show both the conceptual and the technical. For example, on intention, the conceptual showcases how Intention.js could be used beyond just width-based browser detection. It shows a creative implementation that is testament to how this product is conceptually important/useful. 
- For projects, the following is a recommended organization of information:

### Immediately available, top of the page, preferably no scrolling (on a reasonably sized display)
title/site navigation
⇣
the simplest, most explanatory elevator pitch for the project/download links
⇣
an easy-to-understand plug-and-play code sample (like the *most* basic you can write it and still have something cool happen)/a live interactive example. --> I like to think this is a good place to create an image that is both informative and pretty

### "Below the fold"
A sort of lite documentation: something that continues the discussion of "what does this do" while maintaining the tone of a "story". This should be written simplistically and should be able to be read as a narrative 

A sort of index, or table of contents (linkable to sections). Wherever possible, this should take the idea of a document tree.  I don't mean that it has to *look like* a document tree, but super explicit hierarchies of information are useful to someone using the docs as a reference.
⇣
The basics. Think of this as an elaboration of the "above the fold" explanation with more information and less pitch. This should be a conceptual breakdown of why this product exists.
⇣
Usage. This should be a technical explanation (in the most basic sense). If the basics explain why you would use it, Usage explains the fundamentals of *actually using it*. / Dependencies
⇣
Break for a second to show a conceptual breakdown and creative application of the product.
⇣
Move into project-specific documentation bearing in mind that this only a "lite" documentation. It is not the extensive documentation that explains all the options of every method. DocsLite gives a brief introduction to what the tool can do and how it can be done.

## Articles
Each section of lite documentation should be contained in an article, and you should think of it like an article too. It should be self contained, but not independent from its sibling articles (that is, I should be able to read an individual article have not need prior knowledge of other articles, but I should also be able to recognize why it makes sense for this article to be placed where it is.

Following similar logic as above, each article should have important information at the top and descend into either more specific or less important information (like an inverted pyramid). A 2-column layout is suggested to present information to two types of people: those who read documentation and those who try to figure it out from code samples (by copying and pasting). On the left, I suggest keeping the explicit/explanatory paragraph. On the right, I suggest placing a code sample. 
| explanatory par. | |     code sample    |
⇣
Content below this important top section can detail methods and options. 
⇣
It is recommended that each article will end with a link back to the index/table of contents. 
- I feel weird about this one because I feel it involves more clicks than I would like. Though I don't really have plans to do it, I love the idea of rethinking what navigation means. Some maybe fruitful thoughts: how about a document that can be opened on command, take over a significant portion of the screen at any position, and close that closes on clicking a section. No waiting for scrolling, just open a menu and click? I don't know, the less clicks the better. Seeing a document tree is useful though.
