const stringMiddleware = () => (next) => (action) => {// next === dispatch <---- middleware enhancer ni ham aptimallawtirib kodlarimizni qisqartirib beradi
  if (typeof action === "string"){
    return next({type: action})
  }
  return next(action)
}

export default stringMiddleware;