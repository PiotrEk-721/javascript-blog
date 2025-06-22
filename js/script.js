'use strict';

const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLinkBelowArticle: Handlebars.compile(
    document.querySelector('#template-tag-link-below-article').innerHTML
  ),
  templateAuthorName: Handlebars.compile(
    document.querySelector('#template-author-name').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tag-cloud-link').innerHTML
  ),
  authorCloudLink: Handlebars.compile(
    document.querySelector('#template-author-cloud-link').innerHTML
  ),
};

const opts = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
  authorSizes: {
    count: 5,
    classPrefix: 'author-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    titles: '.post-title',
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.tags.list',
    authors: '.list.authors',
  },
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts .post.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  targetArticle.classList.add('active');
}

function generateTitleLinks() {
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(select.all.articles);

  let html = '';
  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(select.all.titles).innerHTML;
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsOrAuthorsParams(parameters) {
  const params = { max: 0, min: Infinity };

  for (let parameter in parameters) {
    if (parameters[parameter] > params.max) {
      params.max = parameters[parameter];
    }
    if (parameters[parameter] < params.min) {
      params.min = parameters[parameter];
    }
  }
  return params;
}

/*
function calculateTagOrAuthorClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);

  return classNumber;
}
*/

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(select.all.articles);
  for (let article of articles) {
    const tagsWrappers = article.querySelector(select.article.tags);
    tagsWrappers.innerHTML = '';
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for (let tag of articleTagsArray) {
      const linkHTMLData = { tag: tag };
      const linkHTML = templates.tagLinkBelowArticle(linkHTMLData);
      html = html + linkHTML;
      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagsWrappers.innerHTML = html;
    const tagList = document.querySelector(select.listOf.tags);
    const tagsParams = calculateTagsOrAuthorsParams(allTags);
    const allTagsData = { tags: [] };
    for (let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        classNameTagPrefix: opts.tagSizes.classPrefix,
        className: calculateTagsOrAuthorsParams(allTags[tag], tagsParams),
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }
}

generateTags();

function generateAuthors() {
  let allAuthors = {};

  const articles = document.querySelectorAll(select.all.articles);
  for (let article of articles) {
    const authorWrappers = article.querySelector(select.article.author);

    const authorText = article.querySelector('.post-author').innerText;
    const authorName = authorText.replace('by ', '');
    const linkHTMLData = { authorName: authorName };
    const linkHTML = templates.templateAuthorName(linkHTMLData);
    authorWrappers.innerHTML = linkHTML;

    if (!allAuthors[authorName]) {
      allAuthors[authorName] = 1;
    } else {
      allAuthors[authorName]++;
    }
  }
  const authorsList = document.querySelector(select.listOf.authors);
  const authorParams = calculateTagsOrAuthorsParams(allAuthors);

  const allAuthorData = { authors: [] };

  for (let author in allAuthors) {
    allAuthorData.authors.push({
      author: author,
      count: allAuthors[author],
      classNameAuthorPrefix: opts.authorSizes.classPrefix,
      className: calculateTagsOrAuthorsParams(allAuthors[author], authorParams),
    });
  }
  authorsList.innerHTML = templates.authorCloudLink(allAuthorData);
}

generateAuthors();
