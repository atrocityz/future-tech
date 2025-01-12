import Header from "./Header.js";
import TabsCollection from "./Tabs.js";
import defineScrollBarWidthCSSVar from './utils/defineScrollBarWidthCSSVar.js'
import VideoPlayerCollection from "./VideoPlayer.js";
import ExpandableContentCollection from "./ExpandableContent.js";

new Header();
new TabsCollection();
new VideoPlayerCollection();
new ExpandableContentCollection();

defineScrollBarWidthCSSVar();