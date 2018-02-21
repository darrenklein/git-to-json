# git-to-json
> Read your project's latest git commit info and write it to JSON

## v1.X.X to v2.X.X

#### Differences

In v2.X.X of git-to-json, the user has more control over the script's behavior. The main differences are:

- The default behavior of v1.X.X was to create a directory adjacent to your `package.json` that would contain the exported git JSON info - that directory is no longer created by default.

- v1.X.X only allowed a user to create a directory one level deep, such as `gitignore/git-commit-info.js` - v2.X.X allows a user to create a directory of any depth, such as `gitignore/git-info/git-commit-info.js`

- The function `maybeRemoveDirectory()` has been removed in this version. This function was only used during a file write error to remove the directory created by running the script, if the directory was otherwise empty. The main feature of interest in v2.X.X is the ability to create nested directories, and I decided that this sort of destructive action was unnecessarily risky as it could end up removing empty directories that the user did not wish to delete.

#### Upgrading

Version 2.X.X of git-to-json includes an additional dependency, [path], so the first step to upgrade your version is to run:

``` SH
npm update git-to-json
```

As noted above, the default behavior has changed slightly - instead of adding a directory and file named `git-commit-info/git-commit-info.js` adjacent to your `package.json` file, git-to-json will now just create the file - the directory is optional. If you were using the basic `git-to-json` command in your project, you would now need to specify the directory name with the `--dir` flag to replicate the behavior:

```
git-to-json --dir git-commit-info
```

If you were already specifying `--dir`, then you should not need to make any changes to your command.

[path]: https://www.npmjs.com/package/path