import { RearguardConfig } from "../../configs/RearguardConfig";

export const group_bootstrap_component = async (options: {
  force: boolean;
  only_dev: boolean;
  debug: boolean;
}): Promise<void> => {
  const CWD = process.cwd();

  console.log("group_bootstrap_component", options);

  const rearguardConfig = new RearguardConfig(CWD);
  const components = rearguardConfig.getComponents();

  // TODO найти все проекты которые были созданы при помощи rearguard.
  // TODO составить список проектов и отсортировать его по зависимостям.
  // TODO выполнить команду для каждого элемента списка.

  console.log(CWD, components);
};
