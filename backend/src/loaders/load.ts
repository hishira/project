import { runLoaders } from './data-loader';
import { RoleLoader } from './role-loader';
import { UserLoader } from './user-loader';

runLoaders([new RoleLoader(), new UserLoader()])
  .then(() => {
    console.log('Loaders executed');
  })
  .catch((err) => {
    console.error(err);
  });
