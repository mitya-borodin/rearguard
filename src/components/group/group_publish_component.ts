export const group_publish_component = async (options: {
  patch: boolean;
  minor: boolean;
  major: boolean;
}): Promise<void> => {
  console.log("group_publish_component", options);
};
