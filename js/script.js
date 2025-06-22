'use strict';

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}

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
    authors: '.authors.list',
  },
};

function generateTitleLinks(){
    
  /* remove contents of titleList */
  const titleList = document.querySelector(select.listOf.titles);
  titleList.innerHTML = '';
    
  /* for each article */
  const articles = document.querySelectorAll(select.all.articles);
    
  let html = '';
  for (let article of articles) {
        
    /* get the article id */
    const articleId = article.getAttribute('id');
        
    /* find the title element */
    const articleTitle = article.querySelector(select.all.titles).innerHTML;
        
    /* get the title from the title element */
        
    /* create HTML of the link */
    const linkHTML = `<li><a href="#${articleId}"><span>${articleTitle}</span></a></li>`;
        
    /* insert link into titleList */
    // console.log(html);
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
    
  const links = document.querySelectorAll('.titles a');
    
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsOrAuthorsParams(parameters){
  const params = { max: 0, min: Infinity};

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

function calculateTagOrAuthorClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );

  return classNumber;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrappers = article.querySelector(select.article.tags);
    console.log(tagsWrappers);
    tagsWrappers.innerHTML = '';

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){

      /* generate HTML of the link */
      const linkHTML = `
      <li>
        <a href="#tag-${tag}">${tag}</a>
      </li>
      `;

      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    console.log(allTags);
    /* END LOOP: for each tag */

    /* insert HTML of all the links into the tags wrapper */
    tagsWrappers.innerHTML = html;

    /* END LOOP: for every article: */
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(select.listOf.tags);

    // /* [NEW] add html from allTags to tagList */
    // tagList.innerHTML = allTags.join(' ');
    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsOrAuthorsParams(allTags);
    console.log('tagsParams', tagsParams);
    let allTagsHTML = '';

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
      /* [NEW] generate code of a link and add it to allTagHTML */
      const tagLinkHTML = `
        <li>
          <a class="${opts.tagSizes.classPrefix}${calculateTagOrAuthorClass(allTags[tag], tagsParams)}" href="#${tag}">${tag}</a>
          (${calculateTagOrAuthorClass(allTags[tag], tagsParams)})
        </li>
      `;

      allTagsHTML += tagLinkHTML;
    }

    /* [NEW] END LOOP: for each tag in allTags: */

    /* [NEW] add html from allTagsHTML to tagList */
    tagList.innerHTML = allTagsHTML;
  }
}

generateTags();

function generateAuthors(){
  let allAuthors = {};
  const articles = document.querySelectorAll(select.all.articles);
  for (let article of articles) {
    const authorWrappers = article.querySelector(select.article.author);
    console.log(authorWrappers);
    authorWrappers.innerHTML = '';
    console.log(authorWrappers);
    let html = '';
    const authorsParams = calculateTagsOrAuthorsParams(allAuthors);
    console.log('authorsParams', authorsParams);
    let allAuthorsHTML = '';
    for(let author in allAuthors){
      const authorLinkHTML = `
        <li>
          <a class="${opts.authorSizes.classPrefix}${calculateTagOrAuthorClass(allAuthors[author], authorsParams)}" href="#${author}">${author}</a>
          (${calculateTagOrAuthorClass(allAuthors[author], authorsParams)})
        </li>
      `;
      allAuthorsHTML += authorLinkHTML;
    }
  }
}

generateAuthors();