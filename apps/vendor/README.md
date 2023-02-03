# Installation Helper

## 1. remove directories

```doc
 app/admin/src/core/redux
 app/admin/src/core/enums
 app/admin/src/services
```

```doc
app/vendor/src/core/redux
app/vendor/src/core/enums
app/vendor/src/services
```

## 2. run commands

```doc
$ pnpm i
$ pnpm typeCheckAll
```

## 3. CodeGen

no difference between CLI below
both directories are in libs/admin-shared

```doc
$ pnpm admin-codegen
$ pnpm vendor-codegen
```

## 4. start vendor project

```js
pnpm vendor
// http://localhost:4001
```

## Tips

- if you can't run the project, please delete node_module and install again

- don't forget to delete the pnpm-lock file
