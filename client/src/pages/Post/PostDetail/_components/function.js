export const handleCharacCount = (text) => {
  let wordCount = 0;
  let characterCount = 0;
  let hashtagCount = 0;

  if (text) {
    const textArr = text.join(" ");
    const words = textArr.split(/\s+/);
    const hashtags = textArr.match(/#[\w]+/g);

    wordCount = words.filter((word) => word.length > 0).length;
    characterCount = textArr.length;
    hashtagCount = hashtags ? hashtags.length : 0;
  }
  return { wordCount, characterCount, hashtagCount };
};
