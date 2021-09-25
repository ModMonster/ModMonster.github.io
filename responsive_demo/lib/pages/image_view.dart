import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';

class ImageViewPage extends StatelessWidget {
  final String image;
  ImageViewPage(this.image, { Key? key }) : super(key: key);

  final PhotoViewController photoViewController = PhotoViewController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Center(
        child: Listener(
          onPointerSignal: (pointerSignal) {
            if (pointerSignal is PointerScrollEvent) {
              photoViewController.setScaleInvisibly(photoViewController.scale! + (-pointerSignal.scrollDelta.dy / 100) * photoViewController.scale!);

              if (photoViewController.scale! < 1) {
                photoViewController.setScaleInvisibly(1);
              } else if (photoViewController.scale! > 6) {
                photoViewController.setScaleInvisibly(6);
              }
            }
          },
          child: PhotoView(
            minScale: 1.0,
            maxScale: 6.0,
            controller: photoViewController,
            backgroundDecoration: BoxDecoration(
              color: Colors.grey[900]
            ),
            heroAttributes: PhotoViewHeroAttributes(
              tag: image
            ),
            imageProvider: NetworkImage(image)
          ),
        ),
      ),
    );
  }
}