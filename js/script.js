'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),   
}

function titleClickHandler(event) {
    
  event.preventDefault();
    
  const clickedElement = this;
    
                                                                        
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
    
  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
    
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
    
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href'); 
    
    
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
    
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors';

// ------------------------------------------------------------------

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
    
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';
    
  for(let article of articles){  
         
    /* get the article id */
    const articleId = article.getAttribute('id'); 
         
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; 
         
    /* get the title from the title element */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert link into html variable */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

// ---------------------------------------------------------------

function calculateTagsParams(tags) {

  const params = {max: 0, min: 999999};

  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }

  return params;
}

//----------------------------------------------------------------

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;

  const normalizedMax = params.max - params.min;

  const percentage = normalizedCount / normalizedMax;

  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );


  return optCloudClassPrefix + classNumber;

}

// ----------------------------------------------------------------

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
    
  /* START LOOP: for every article: */
  for(let article of articles){
    
    /* find tags wrapper */
    const titleList = article.querySelector(optArticleTagsSelector);
   
    /* make html variable with empty string */
    let html = '';
    
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
      
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
      
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

      /* generate HTML of the link */
      const tagLinkHTMLData = {tag: tag};
      const tagLinkHTML = templates.tagLink(tagLinkHTMLData);   
        
      /* add generated code to html variable */
      html = html + tagLinkHTML;
     
        
      
      if(!allTags.hasOwnProperty(tag)){
    
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      
    }
      
    /* insert HTML of all the links into the tags wrapper */
     titleList.innerHTML = html;
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
    
  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};
    
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){

    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* [NEW] add html from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log('allTagsData: ', allTagsData);
}
generateTags();

// -----------------------------------------------------------------------

function tagClickHandler(event){
    
  /* prevent default action for this event */
  event.preventDefault();
    
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href'); 

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
    
  /* find all tag links with class active */
  const activeTags  = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags) {   
    activeTag.classList.remove('active');
  }
    
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksHref = document.querySelectorAll('a[href="' + href + '"]');
    
  /* START LOOP: for each found tag link */
  for(let tagLinkHref of tagLinksHref){  
    tagLinkHref.classList.add('active');
  }
 
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

// ------------------------------------------------------------------

function addClickListenersToTags(){
    
  /* find all links to tags */
  const allLinksToTags = document.querySelectorAll('a[href^="#tag-"]');
    
  /* START LOOP: for each link */
  for(let link of allLinksToTags){
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();

// -------------------------------------------------------------------------

function calculateAuthorParams(authors) {

  const authorParams = {max: 0, min: 999999};

  for(let author in authors){
    if(authors[author] > authorParams.max){
      authorParams.max = authors[author];
    }
    if(authors[author] < authorParams.min){
      authorParams.min = authors[author];
    }
  }

  return authorParams;
}

// -------------------------------------------------------------------------

function generateAuthors(){

  //NEW
  let allAuthors = {};

  const articles = document.querySelectorAll(optArticleSelector);

  for(let article of articles){

    const titleList = article.querySelector(optArticleAuthorSelector);

    let html = '';

    const authorTags = article.getAttribute('data-author');
      
    const authorLinkHTMLData = {authorTags: authorTags};
    const authorLinkHTML = templates.authorLink(authorLinkHTMLData);  
      
    html = html + authorLinkHTML;

    //NEW
    if(!allAuthors.hasOwnProperty[authorTags]){

      allAuthors[authorTags] = 1;

    } else {

      allAuthors[authorTags]++;

    }

    titleList.innerHTML = html;

  }

  const authorsList = document.querySelector(optAuthorsListSelector);

  const authorParams = calculateAuthorParams(allAuthors);

  const allAuthorsData = {authors: []};
  for(let author in allAuthors){
      
    //const authorLinkHTML = '<li><a class="' + calculateAuthorClass(allAuthors[author], authorParams) + '" href="#author-' + author + '">' + author + '</a></li>';
    //const authorLinkHTML = '<li><a href="#author-' + author + '">' + author + ' (' + allAuthors[author] +') ' + '</a></li> ';
    //allAuthorsHTML += authorLinkHTML;
    allAuthorsData.authors.push({
      author: author,

    });
  }
  authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);
}
generateAuthors();
// -----------------------------------------------------------------------------


function authorClickHandler(event){

  event.preventDefault();

  const clickedElement = this;
  
  const href = clickedElement.getAttribute('href');

  const tag = href.replace('#author-', '');

  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  for(let authorLink of authorLinks) {

    authorLink.classList.remove('active');

  }

  const authorLinksHref = document.querySelectorAll('a[href="' + href + '"]');

  for(let authorLinkHref of authorLinksHref){

    authorLinkHref.classList.add('active');

  }

  generateTitleLinks('[data-author="' + tag + '"]');

}


// ---------------------------------------------------------------------------



function addClickListenersToAuthors(){
    
  const allLinksToAuthors = document.querySelectorAll('a[href^="#author-"]');
    
  for(let link of allLinksToAuthors){
      
    link.addEventListener('click', authorClickHandler);
      
  }
}

addClickListenersToAuthors();
  