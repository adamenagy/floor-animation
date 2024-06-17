const clientId = "";
// This is only for testing purposes. In a real-world application you should never expose your client secret
// to the client side code. You should always use a server side code to get the access token.
const clientSecret = "";
// Can get sample models from here: 
// https://help.autodesk.com/view/RVT/2024/ENU/?guid=GUID-61EF2F22-3A1F-4317-B925-1E85F138BE88
const urn = "";
const urn2 = "";
const explodeScale = 2;

let viewer;
let aecData;

async function getAccessToken(callback) {
  const response = await fetch(
    "https://developer.api.autodesk.com/authentication/v2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=bucket:read data:read data:create data:write viewables:read data:search`,
    }
  );

  const data = await response.json();
  callback(data.access_token, data.expires_in);
}

function loadModel(urn) {
  options = {
    useADP: false,
    env: "AutodeskProduction",
    getAccessToken: getAccessToken,
    isAEC: true,
  };
  
  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById("viewer"));
    viewer.start();
    viewer.setTheme("light-theme");
    Autodesk.Viewing.Document.load(`urn:${urn}`, (doc) => {
      const geometries = doc.getRoot().search({ type: "geometry", role: "3d" });
      viewer.loadDocumentNode(doc, geometries[0]);
    });
    Autodesk.Viewing.Document.load(`urn:${urn}`, async (doc) => {
      const geometries = doc.getRoot().search({ type: "geometry", role: "3d" });

      viewer.start();
      viewer.setTheme("light-theme");

      let model = await viewer.loadDocumentNode(doc, geometries[0]);

      doc.downloadAecModelData((data) => {
        aecData = data;
        aecData.height =
          aecData.levels[aecData.levels.length - 1].elevation -
          aecData.levels[0].elevation;
        console.log(aecData.levels);
      });

      if (urn2) {
        Autodesk.Viewing.Document.load(`urn:${urn2}`, async (doc) => {
          doc.downloadAecModelData();

          const geometries = doc
            .getRoot()
            .search({ type: "geometry", role: "3d" });

          viewer.loadDocumentNode(doc, geometries[0], {
            keepCurrentModels: true,
            globalOffset: model.myData.globalOffset,
          });
        });
      }
    });
  });
}

function onSlider(val) {
  floorExplode(viewer, aecData.height * val * explodeScale, aecData.levels);
  viewer.impl.sceneUpdated(true);
}

loadModel(urn);
