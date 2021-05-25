import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import topicGraphReducer from '../features/topicGraph/topicGraphSlice';
import detailsCardReducer from '../features/detailsCard/detailsCardSlice';
import newTopicDialogReducer from '../features/newTopicDialog/newTopicDialogSlice';
import editTopicDialogReducer from '../features/editTopicDialog/editTopicDialogSlice';
import contextMenuReducer from '../features/contextMenu/contextMenuSlice';
import exportMenuReducer from '../features/exportMenu/exportMenuSlice';
import searchBarReducer from '../features/searchBar/searchBarSlice';
import disciplineDropdownReducer from '../features/disciplineDropdown/disciplineDropdownSlice';

import documentViewerReducer from '../features/documentViewer/documentViewerSlice';
import markdownEditorReducer from '../features/markdownEditor/markdownEditorSlice';

import networkReducer from '../features/network/networkSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    topicGraph: topicGraphReducer,
    detailsCard: detailsCardReducer,
    newTopicDialog: newTopicDialogReducer,
    editTopicDialog: editTopicDialogReducer,
    contextMenu: contextMenuReducer,
    exportMenu: exportMenuReducer,
    searchBar: searchBarReducer,
    disciplineDropdown: disciplineDropdownReducer,

    documentViewer: documentViewerReducer,
    markdownEditor: markdownEditorReducer,

    network: networkReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
  devtools: true
});
