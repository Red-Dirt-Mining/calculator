Thanks for showing interest to contribute to The Open Source Calculator. You rock!

When it comes to open source, there are different ways you can contribute, all
of which are valuable. Here are a few guidelines that should help you as you
prepare your contribution.

## Setup the Project

The following steps will get you up and running to contribute to Chakra UI:

1. Fork the repo (click the <kbd>Fork</kbd> button at the top right of
   [this page](https://github.com/Red-Dirt-Mining/calculator).

2. Clone your fork locally

```sh
git clone https://github.com/<your_github_username>/calculator.git
cd calculator
```

3. Setup all the dependencies and packages by running `npm install`. This
   command will install dependencies.

> If you run into any issues during this step, kindly reach out to the Open Source Mining Calculator Community on [Telegram](https://t.me/+BHZdyAKFFoVlOGIx).

### Tooling

- [npm](https://docs.npmjs.com/about-npm) to manage packages and dependecnies
- [Create-react-app](https://create-react-app.dev/) for rapid development and deployment 
- [Chakra UI](https://chakra-ui.com/) for rapid UI component development and
  testing
- [Recharts](https://recharts.org/en-US/) for composable react charts

### Commands

**`npm install`**: bootstraps the entire project, symlinks all dependencies for
cross-component development and builds all components.

**`npm start`**: starts the project locally.

**`npm run build`**: run build for all component packages.


## Think you found a bug?

Please conform to the issue template and provide a clear path to reproduction
with a code example if possible. The best way to show a bug is by sending a CodeSandbox
link.

## Proposing new or changed features?

Please provide thoughtful comments and, if possible, some code. Proposals that
don't line up with our roadmap or don't have a thoughtful explanation will be
closed.

## Making a Pull Request?

Pull requests need only the :+1: of two or more collaborators to be merged; when
the PR author is a collaborator, that counts as one.

### Commit Convention

Before you create a Pull Request, please check whether your commits comply with
the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention
`category(scope or module): message` in your commit message while using one of
the following categories:

- `feat / feature`: all changes that introduce completely new code or new
  features
- `fix`: changes that fix a bug (ideally you will additionally reference an
  issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for
  usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to
  dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing
  ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e.
  github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above
  categories

If you are interested in the detailed specification you can visit [Conventional Commits](https://www.conventionalcommits.org/).

### Steps to PR

1. Fork of the calculator repository and clone your fork

2. Create a new branch out of the `main` branch. We follow the convention
   `[type/scope]`. For example `fix/accordion-hook` or `docs/menu-typo`. `type`
   can be either `docs`, `fix`, `feat`, `build`, or any other conventional
   commit type. `scope` is just a short id that describes the scope of work.

3. Make and commit your changes following the
   commit conventions mentioned above.

## Want to write a blog post or help improve our docs?
That would be amazing! Reach out to the core team [here](https://t.me/+BHZdyAKFFoVlOGIx). We would love to support you any way we can.

## License
By contributing your code to the Open Source Mining Calulator GitHub repository, you agree to
license your contribution under the MIT license.
