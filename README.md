# vuex-store-action

> warning!: es6 required  

## Features

- Mutation-type based call. 
- Simple Action ( by-pass payload into mutation )
- Promise Action ( commit pending, success, error mutation after api then() call )
- Provide ignore catch error option

## Installing

Using npm:
```bash
$ npm i vuex-store-action
```

Using yarn:
```bash
$ yarn add vuex-store-action
```

## Examples

### Action

#### Simple Action
```js
const SET_TOGGLE_MENU = 'SET_TOGGLE_MENU';

const actions = {
    setToggleMenu: createAction(SET_TOGGLE_MENU)
};
const mutations = handleMutations({
    [SET_TOGGLE_MENU](state, toggle) {
        state.currentToggle = toggle;
    }
});
```

#### Promise Action
```js
// Promise api
const GET_ARTICLE = 'GET_ARTICLE';
const getArticleInfo = params => axios.get(`http://api.test.com/article/${params.cardNo}`);

const state = {
    article: {}
};
const actions = {
    getArticle: createAction(GET_ARTICLE, params => getArticleInfo(params)),
};
const mutations = handleMutations({
    [GET_ARTICLE](state, article) {
        state.article = article;
    }
});
```

#### Promise Action ( pending, success, error )
```js
// Promise api
const GET_ARTICLE = 'GET_ARTICLE';
const getArticleInfo = params => axios.get(`http://api.test.com/article/${params.cardNo}`);

const state = {
    article: {}
};
const actions = {
    getArticle: createAction(GET_ARTICLE, params => getArticleInfo(params)),
};
const mutations = handleMutations({
    [GET_ARTICLE]: {
        pending(state) {
            // after api call
        },
        success(state, article) {
            // after api then success
            state.article = article;
        },
        error(state, error) {
            // after api then error
            console.log(error);
        }
    }
});
```

#### ignore Caught
```js
// Promise api
const GET_ARTICLE = 'GET_ARTICLE';
const getArticleInfo = params => axios.get(`http://api.test.com/article/${params.cardNo}`);

const actions = {
    getArticle: createAction(GET_ARTICLE, params => getArticleInfo(params), true),
};
```

## License

MIT 


## Browser Support
## Dependencies