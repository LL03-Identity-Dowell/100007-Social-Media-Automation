export const handleCharacCount = () => {
  const postParagraphsDiv = document.getElementById("post-paragraphs");
  let wordCount = 0;
  let characterCount = 0;
  let hashtagCount = 0;

  if (postParagraphsDiv) {
    const text = postParagraphsDiv.innerText.replace(/\n/g, "");

    const words = text.split(/\s+/);
    const hashtags = text.match(/#[\w]+/g);

    wordCount = words.filter((word) => word.length > 0).length;
    characterCount = text.length;
    hashtagCount = hashtags ? hashtags.length : 0;
  }
  return { wordCount, characterCount, hashtagCount };
};
