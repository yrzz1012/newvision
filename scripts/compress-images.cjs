const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const MAX_WIDTH = 2560;
const QUALITY = 85;

async function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      await compress(full);
    }
  }
}

async function compress(filePath) {
  const origSize = fs.statSync(filePath).size;
  // 已经 < 2MB 的跳过
  if (origSize < 2 * 1024 * 1024) {
    process.stdout.write('.');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const tmpPath = filePath + '.tmp';

  try {
    let pipeline = sharp(filePath).resize(MAX_WIDTH, null, { withoutEnlargement: true });

    if (ext === '.png') {
      pipeline = pipeline.png({ quality: QUALITY });
    } else {
      pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
    }

    await pipeline.toFile(tmpPath);

    const newSize = fs.statSync(tmpPath).size;
    // 如果压缩后反而变大，不替换
    if (newSize >= origSize) {
      fs.unlinkSync(tmpPath);
      process.stdout.write('.');
      return;
    }

    // 确保压缩后不超过 20MB
    if (newSize > 20 * 1024 * 1024) {
      // 再降一次 quality
      await sharp(filePath).resize(1920, null, { withoutEnlargement: true })
        .jpeg({ quality: 70, mozjpeg: true }).toFile(tmpPath);
    }

    fs.renameSync(tmpPath, filePath);
    const origMB = (origSize / 1024 / 1024).toFixed(1);
    const newMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(1);
    const reduction = ((1 - fs.statSync(filePath).size / origSize) * 100).toFixed(0);
    console.log(`\n${path.relative(IMAGES_DIR, filePath)}: ${origMB}MB → ${newMB}MB (-${reduction}%)`);
  } catch (err) {
    console.error(`\nError: ${filePath}: ${err.message}`);
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}

console.log('Compressing images (quality mode)...');
walk(IMAGES_DIR).then(() => console.log('\nDone!'));
