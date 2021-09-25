import 'package:flutter/material.dart';
import 'package:responsive_demo/pages/image_view.dart';

class PhotoPage extends StatelessWidget {
  final List<String> photos;
  const PhotoPage(this.photos,  {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return GridView.builder(
          itemCount: photos.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: (constraints.maxWidth / 150).floor().clamp(3, double.infinity).toInt(),
            mainAxisSpacing: 4,
            crossAxisSpacing: 4
          ),
          itemBuilder: (context, index) {
            return InkWell(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) {return ImageViewPage(photos[index]);}));
              },
              child: Hero(
                tag: photos[index],
                child: Image.network(
                  photos[index],
                  fit: BoxFit.cover,
                )
              ),
            );
          },
        );
      }
    );
  }
}