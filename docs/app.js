const accessToken =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY0RE9XMnJoOE9tbjNpdk1NU0xlNGQ2VHEwUV9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJidWNrZXQ6cmVhZCIsImJ1Y2tldDpkZWxldGUiLCJidWNrZXQ6dXBkYXRlIiwiYnVja2V0OmNyZWF0ZSJdLCJjbGllbnRfaWQiOiJyR20wbU85alZTc0QyeUJFRGs5TVJ0WFFUd3NhNjF5MCIsImlzcyI6Imh0dHBzOi8vZGV2ZWxvcGVyLmFwaS5hdXRvZGVzay5jb20iLCJhdWQiOiJodHRwczovL2F1dG9kZXNrLmNvbSIsImp0aSI6IlpWQTBTVWRZSkxVOTZBc2lKQ3lIQzZxUHZXbVJtUlVpd3RtNWNRSjBTTWJzNGtZQm9Oem8yN21OYTNvNGRQbDQiLCJleHAiOjE3MTg2MjUyNTV9.ugXO631gMPzf7x9PPLJRxQAYBEWCd6mkBBmzycKZu4xaxDsL6yzFel5zLyG7PhxsFNT68jAvpaMl4MCYkaGmVQuWC7eYWwMcj2cwvviPpqaUmdJbcIS9rkcVUAsGggh4gSiNPWwjZdfjQkFtytSVoDHn7wW27udrdtynUxKQMUYRxt-dajWJpMhPPQ4-zQlFJKcApAhPj9qUlVQWFjLxfIovq8q66ou3wKcgTVZrwkpihaZ1FeXKHmGubYsngH1JS35BfcgVq-CkiPpx1vkuWLzlwNNlM28kSqeng0InG-xF88JmStM6wRDbf3TtoUwf1jAMwzdCWo7rrIBs4mTsPA";
const urn =
  "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRhbV8yMDE5MDMwNzIvcmFjX2Jhc2ljX3NhbXBsZV9wcm9qZWN0LnJ2dA";
const urn2 =
  "dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YWRhbV8yMDE5MDMwNzIvcnN0YmFzaWNzYW1wbGVwcm9qZWN0LnJ2dA";
const explodeScale = 2;

let viewer;
var aecData;

function loadModel(urn) {
  options = {
    useADP: false,
    env: "AutodeskProduction",
    accessToken: accessToken,
    isAEC: true,
  };
  viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById("viewer"));
  Autodesk.Viewing.Initializer(options);
  Autodesk.Viewing.Document.load(`urn:${urn}`, async (doc) => {
    doc.downloadAecModelData((data) => {
      aecData = data;
      aecData.height =
        aecData.levels[aecData.levels.length - 1].elevation -
        aecData.levels[0].elevation;
      console.log(aecData.levels);
    });

    const geometries = doc.getRoot().search({ type: "geometry", role: "3d" });

    viewer.start();
    viewer.setTheme("light-theme");

    let model = await viewer.loadDocumentNode(doc, geometries[0]);

    if (urn2) {
      Autodesk.Viewing.Document.load(`urn:${urn2}`, async (doc) => {
        doc.downloadAecModelData();

        const geometries = doc
          .getRoot()
          .search({ type: "geometry", role: "3d" });

        viewer.start();
        viewer.setTheme("light-theme");

        viewer.loadDocumentNode(doc, geometries[0], {
          keepCurrentModels: true,
          globalOffset: model.myData.globalOffset,
        });
      });
    }
  });
}

function onSlider(val) {
  floorExplode(viewer, aecData.height * val * explodeScale, aecData.levels);
  viewer.impl.sceneUpdated(true);
}

loadModel(urn);
