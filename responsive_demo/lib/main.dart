import 'package:device_preview/device_preview.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_speed_dial/flutter_speed_dial.dart';
import 'package:responsive_demo/pages/photos.dart';

void main() {
  runApp(
    DevicePreview(
      enabled: false, //!kReleaseMode,
      builder: (context) {
        return MaterialApp(
          home: const HomePage(),
          darkTheme: ThemeData(
            brightness: Brightness.dark
          ),
        );
      }
    )
  );
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final GlobalKey uploadButtonPCKey = GlobalKey();  

  final List<Destination> destinations = [
    Destination(
      icon: Icons.collections,
      label: "My Photos"
    ),
    Destination(
      icon: Icons.folder_shared,
      label: "Sharing"
    ),
    Destination(
      icon: Icons.star,
      label: "Favourites"
    ),
    Destination(
      icon: Icons.archive,
      label: "Archive"
    ),
  ];

  int pageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      PhotoPage(List<String>.generate(240, (index) {
        return "https://picsum.photos/seed/$index/480/720";
      })
      ),
      Container(),
      Container(),
      Container(),
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        int navigationType;

        // 0: phone
        // 1: tablet
        // 2: pc

        if (constraints.maxWidth < 600) {
          navigationType = 0;
        } else if (constraints.maxWidth < 1200) {
          navigationType = 1;
        } else {
          navigationType = 2;
        }
        
        return Scaffold(
          appBar: AppBar(
            title: const Text("Monster Photos"),
          ),
          floatingActionButton: navigationType == 2? null : SpeedDial(
            icon: Icons.add,
            activeIcon: (Icons.close),
            tooltip: "Upload",
            children: [
              SpeedDialChild(
                child: const Icon(Icons.photo),
                onTap: () {},
                label: 'Photo',
              ),
              SpeedDialChild(
                child: const Icon(Icons.photo_album),
                onTap: () {},
                label: 'Album',
              ),
              SpeedDialChild(
                child: const Icon(Icons.animation),
                onTap: () {},
                label: 'Animation',
              ),
            ],
          ),
          body: navigationType > 0? 
          // tablet or pc
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Visibility(
                    visible: navigationType == 2,
                    child: Container(
                      color: Theme.of(context).colorScheme.surface,
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: SizedBox(
                          width: 240,
                          child: ElevatedButton.icon(
                            key: uploadButtonPCKey,
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.all(24),
                              shape: const StadiumBorder(),
                            ),
                            onPressed: () {
                              showMenu(
                                context: context,
                                position: const RelativeRect.fromLTRB(0, 60, 0, 0),
                                items: [
                                  PopupMenuItem(
                                    child: SizedBox(
                                      width: 200,
                                      child: Row(
                                        children: const [
                                          Icon(Icons.photo),
                                          SizedBox(width: 12),
                                          Text("Photo"),
                                        ],
                                      ),
                                    )
                                  ),
                                  PopupMenuItem(
                                    child: SizedBox(
                                      width: 200,
                                      child: Row(
                                        children: const [
                                          Icon(Icons.photo_album),
                                          SizedBox(width: 12),
                                          Text("Album"),
                                        ],
                                      ),
                                    )
                                  ),
                                  PopupMenuItem(
                                    child: SizedBox(
                                      width: 200,
                                      child: Row(
                                        children: const [
                                          Icon(Icons.animation),
                                          SizedBox(width: 12),
                                          Text("Animation"),
                                        ],
                                      ),
                                    )
                                  ),
                                ]
                              );
                            },
                            icon: const Icon(Icons.add),
                            label: const Text("Upload"),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: NavigationRail(
                      extended: navigationType == 2,
                      onDestinationSelected: (value) {
                        setState(() {
                          pageIndex = value;
                        });
                      },
                      labelType: navigationType == 1? NavigationRailLabelType.selected : null,
                      destinations: destinations.map((destination) =>
                      NavigationRailDestination(
                        icon: Icon(destination.icon),
                        label: Text(destination.label ?? ""),
                      )).toList(),
                      selectedIndex: pageIndex
                    ),
                  ),
                ],
              ),
              Expanded(child: pages[pageIndex])
            ],
          ):

          // phone
          pages[pageIndex],
          bottomNavigationBar: navigationType == 0?
          BottomNavigationBar(
            currentIndex: pageIndex,
            onTap: (value) {
              setState(() {
                pageIndex = value;
              });
            },
            selectedItemColor: Colors.blue,
            unselectedItemColor: Colors.grey[700],
            items: destinations.map((destination) => BottomNavigationBarItem(label: destination.label, icon: Icon(destination.icon))).toList()
          ) : null
        );
      }
    );
  }
}

class Destination {
  final String? label;
  final IconData? icon;
  Destination({this.label, this.icon});
}