export const mapResponseFromApiModel = response => {
  return response.data.map(category => {
    return { id: category.id, name: category.attributes.name };
  });
};
