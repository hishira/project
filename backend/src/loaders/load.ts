import { runLoaders } from './data-loader';
import { RoleLoader } from './role-loader';

runLoaders([new RoleLoader()])
  .then(() => {
    console.log('Loaders executed');
  })
  .catch((err) => {
    console.error(err);
  });
