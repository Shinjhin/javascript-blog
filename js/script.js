'use strict';

function titleClickHandler(event) {
    
  event.preventDefault();
    
  const clickedElement = this;
  console.log('Link was clicked!');
    
                                                                        
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
    
  /* add class 'active' to the clicked link */
  console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');
    
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
    
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href'); 
  console.log(articleSelector);
    
    
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);
    
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author';

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  console.log(titleList);
    
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';
    
  for(let article of articles){  
         
    /* get the article id */
    const articleId = article.getAttribute('id'); 
         
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; 
         
    /* get the title from the title element */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

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

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function generateTags(){
    
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
    
  /* START LOOP: for every article: */
  for(let article of articles){
      
    /* find tags wrapper */
    const tagList = article.querySelector(optArticleTagsSelector);
      
    /* make html variable with empty string */
    let html = '';
      
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');  
      
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ')
      
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

    /* generate HTML of the link */
      const tagLinkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li> ';

    /* add generated code to html variable */
      html = html + tagLinkHTML;  
    }
      
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;
  }
}

generateTags();

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function addClickListenersToTags(){
    
  /* find all links to tags */
  const allLinksToTags = document.querySelectorAll('a[href^="#tag-"]');
    
  /* START LOOP: for each link */
  for(let link of allLinksToTags){
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();
 
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

function generateAuthors(){ 
  
}

generateAuthors();

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

