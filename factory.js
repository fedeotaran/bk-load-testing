export const all_images = () => {
  const directoryPath = "./assets/images";
  const files = [
    { content_type: "image/jpeg", filename: "eiffel.JPG" },
    { content_type: "image/tiff", filename: "board.tiff" },
    { content_type: "image/jpeg", filename: "tux.jpg" },
    { content_type: "image/webp", filename: "webp.webp" },
    { content_type: "image/svg+xml", filename: "kiwi.svg" },
    { content_type: "image/jpeg", filename: "lake.jpeg" },
    { content_type: "image/png", filename: "rust_original.png" },
  ].map((data) => ({
    filename: data.filename,
    content_type: data.content_type,
    content: open(`${directoryPath}/${data.filename}`, "b"),
  }));

  return files;
};


export const get_random = (list) => {
  return list[Math.floor(Math.random() * list.length)];
};
