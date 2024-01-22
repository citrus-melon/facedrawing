let model;

class Rescaling extends tf.layers.Layer {
 constructor() {
   super({});
 }

 computeOutputShape(inputShape) { return inputShape }

 call(input, kwargs) { 
   return tf.tidy(() => {
      const k = 255;
      return tf.div(input[0], k);
    });
  }

 static className = 'Rescaling';
}

tf.serialization.registerClass(Rescaling);

(async function() {
  model = await tf.loadLayersModel('exported_model/model.json');
})();

const confidenceText = document.getElementById('confidence');
const resultText = document.getElementById('result');
const inputPage = document.getElementById('inputPage');
const resultPage = document.getElementById('resultPage');

function predict() {
  // Make the prediction itself
  if (!model) return;
  const img = tf.browser.fromPixels(canvas, 4).resizeBilinear([100,100]);
  const batch = img.expandDims(0);
  const prediction = model.predict(batch).softmax()
  const result = prediction.argMax(1).arraySync()[0];
  const confidence = prediction.max().arraySync();
  console.log(confidence);

  // Update the UI elements
  inputPage.classList.remove('visible');
  resultPage.classList.add('visible');
  clearImage();
  if (result === 0) {
    resultText.innerText = 'FROWNY';
  } else {
    resultText.innerText = 'SMILEY';
  }
  confidenceText.innerText = confidence*100 + '% confident';
}

function tryAgain() {
  inputPage.classList.add('visible');
  resultPage.classList.remove('visible');
}