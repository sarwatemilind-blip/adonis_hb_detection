function rgb2hsv(r, g, b) {
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let d = max - min;
  let h = 0, s = (max === 0 ? 0 : d / max);
  if (max !== min) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    h /= 6;
  }
  let H = Math.round(h * 180);
  if(H>=180) H=0;
  return [H, Math.round(s * 255), max];
}

function rgb2lab(r, g, b) {
  let R = r / 255, G = g / 255, B = b / 255;
  R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
  G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
  B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;
  let X = R * 0.412453 + G * 0.357580 + B * 0.180423;
  let Y = R * 0.212671 + G * 0.715160 + B * 0.072169;
  let Z = R * 0.019334 + G * 0.119193 + B * 0.950227;
  X /= 0.950456; Y /= 1.000000; Z /= 1.088754;
  let fX = X > 0.008856 ? Math.pow(X, 1/3) : (7.787 * X) + (16 / 116);
  let fY = Y > 0.008856 ? Math.pow(Y, 1/3) : (7.787 * Y) + (16 / 116);
  let fZ = Z > 0.008856 ? Math.pow(Z, 1/3) : (7.787 * Z) + (16 / 116);
  let L = (116 * fY) - 16;
  let a = 500 * (fX - fY);
  let b = 200 * (fY - fZ);
  return [
    Math.round(L * 255 / 100),
    Math.round(a + 128),
    Math.round(b + 128)
  ];
}

function getPercentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  let index = (sortedArr.length - 1) * p / 100;
  let lower = Math.floor(index);
  let upper = lower + 1;
  let weight = index % 1;
  if (upper >= sortedArr.length) return sortedArr[lower];
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

function getMedian(sortedArr) {
  return getPercentile(sortedArr, 50);
}

function mean(arr) {
  if(arr.length===0) return 0;
  let sum=0; for(let i=0;i<arr.length;i++) sum+=arr[i];
  return sum/arr.length;
}

function extractCombinedFeatures(imageData) {
  // imageData is ImageData object (width, height, data RGBA)
  let d = imageData.data;
  let n = d.length / 4;
  
  let R = new Float32Array(n), G = new Float32Array(n), B = new Float32Array(n);
  let H = new Float32Array(n), S = new Float32Array(n), V = new Float32Array(n);
  let LL = new Float32Array(n), aa = new Float32Array(n), bb = new Float32Array(n);
  
  let r_minus_g = new Float32Array(n);
  let r_over_g = new Float32Array(n);
  let r_minus_b = new Float32Array(n);

  for (let i = 0; i < n; i++) {
    let r = d[i*4], g = d[i*4+1], b = d[i*4+2];
    
    // float pix
    R[i] = r/255.0; G[i] = g/255.0; B[i] = b/255.0;
    r_minus_g[i] = R[i] - G[i];
    r_over_g[i] = R[i] / (G[i] + 1e-3);
    r_minus_b[i] = R[i] - B[i];
    
    let hsv = rgb2hsv(r,g,b);
    H[i] = hsv[0]; S[i] = hsv[1]; V[i] = hsv[2];
    
    let lab = rgb2lab(r,g,b);
    LL[i] = lab[0]; aa[i] = lab[1]; bb[i] = lab[2];
  }
  
  // Sort arrays for median/percentiles
  let R_s = Float32Array.from(R).sort();
  let G_s = Float32Array.from(G).sort();
  let B_s = Float32Array.from(B).sort();
  
  let H_s = Float32Array.from(H).sort();
  let S_s = Float32Array.from(S).sort();
  let V_s = Float32Array.from(V).sort();
  
  let LL_s = Float32Array.from(LL).sort();
  let aa_s = Float32Array.from(aa).sort();
  let bb_s = Float32Array.from(bb).sort();

  let computeStats = () => {
    return [
      mean(R), getMedian(R_s), getPercentile(R_s, 10), getPercentile(R_s, 90),
      mean(G), getMedian(G_s), getPercentile(G_s, 10), getPercentile(G_s, 90),
      mean(B), getMedian(B_s), getPercentile(B_s, 10), getPercentile(B_s, 90),
      mean(r_minus_g), mean(r_over_g), mean(r_minus_b),
      mean(H), getMedian(H_s),
      mean(S), getMedian(S_s),
      mean(V), getMedian(V_s),
      mean(LL), getMedian(LL_s),
      mean(aa), getMedian(aa_s),
      mean(bb), getMedian(bb_s),
      1.0 // area = 1.0 since we fake the mask for the whole cropped region
    ];
  };

  let stats = computeStats();
  
  // Return duplicated for t1, t128, t250
  let feats = new Float32Array(84);
  for(let i=0;i<28;i++){
    feats[i] = stats[i];
    feats[i+28] = stats[i];
    feats[i+56] = stats[i];
  }
  return feats;
}
