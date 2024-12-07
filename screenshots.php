<?php

$images = [];
$n = 1001;
for ($i = 0; $i < 13; $i++) {
    $images[] = imagecreatefrompng('screenshots/screenshot-' . substr($n, 1) . '.png');
    $n++;
}

if (sizeof($images) > 0) {
    $screenshotWidth = imagesx($images[0]);
    $screenshotHeight = imagesy($images[0]);
    $sourceHeight = ceil(sizeof($images) / 5) * $screenshotHeight;
    $source = imagecreatetruecolor(5 * $screenshotWidth, $sourceHeight);
    $white = imagecolorallocate($source, 255, 255, 255);
    imagefill($source, 0, 0, $white);
    $x = 0;
    $y = 0;
    for ($i = 0; $i < sizeof($images); $i++) {
        imagecopymerge(
            $source,
            $images[$i],
            ($x * 200),
            ($y * $screenshotHeight),
            0,
            0,
            $sourceHeight,
            $screenshotHeight,
            100
        );
        $x++;
        if($x == 5){
            $x = 0;
            $y++;
        }
    }
    imagepng($source,'screen.png');
}
