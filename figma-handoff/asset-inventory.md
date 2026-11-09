# Skyppy 2.0 — Asset Inventory

## 1. Typography Fonts
- **Brand Wordmark & Logo Typography**: `QurovaDEMO-Medium` / `Qurova`
  - Asset file: `src/assets/fonts/qurova-demo.medium.otf` (retrieved from `https://www.skyppy.app/fonts/qurova-demo.medium.otf`)
  - Usage: Official "Skyppy" header brand wordmark, vehicle tier headers, hero display titles.
- **Headlines & Numbers**: `Manrope` (Weights: 600, 700, 800)
  - Google Fonts CDN: `family=Manrope:wght@600;700;800`
- **Body & Labels**: `Inter` (Weights: 400, 500, 600, 700)
  - Google Fonts CDN: `family=Inter:wght@400;500;600;700`
- **Iconography**: `Material Symbols Outlined` (Variable font: `FILL` 0..1, `wght` 100..700, `GRAD` -50..200, `opsz` 20..48)

---

## 2. Iconography Mapping (Material Symbols)

| Symbol Name | Component Context | Purpose |
|---|---|---|
| `near_me` | App Header Logo | Skyppy brand navigation mark |
| `directions_car` | Bottom Nav / Vehicle Card | Rides Home icon & Cab identifier |
| `electric_rickshaw` | Vehicle Selector / Map Pin | Auto Rickshaw identifier & GPS telemetry marker |
| `receipt_long` | Bottom Nav / Activity | Activity & Ride history ledger |
| `military_tech` | Bottom Nav / Miles | Skyppy Miles loyalty program |
| `person` | Bottom Nav / Profile | Rider Account & Profile |
| `search` | Search Input | Destination search trigger |
| `location_on` | Location Pins | Destination marker (Red) |
| `my_location` | Map Controls | Pickup origin pin & Recenter map |
| `shield` | Header Action / Safety | 24/7 Safety Toolkit |
| `notifications` | Header Action | Live transit alerts & updates |
| `calendar_clock` | Header Action / Schedule | Advance trip booking |
| `chat` | Driver Pod / Tracking | In-app messaging with driver |
| `phone` | Driver Pod / Tracking | Direct driver telephone call |
| `check` | Checkmarks & Confirmations | Booking confirmed & Selected vehicle |
| `verified` | Profile & Driver Pod | Verified driver & Tier badge |
| `star` | Driver Rating | Rating star (5.0★) |
| `swap_vert` | Search & Verification | Swap origin and destination |
| `palette` | Profile / Settings | Appearance & Theme switcher |

---

## 3. Image & Brand Assets

| Image Description | File / URL | Usage |
|---|---|---|
| Official Skyppy Emblem SVG | `src/assets/skyppy-icon.svg` (`https://www.skyppy.app/icon.svg`) | Scalable vector squircle (`rx="115"`) with Qurova 'S', used in `SkyppyLogo` component, header, and confirmation radar animation. |
| Official App Icon PNG | `src/assets/skyppy-app-icon.png` (512×512 HD) | Verified Play Store app icon for splash/profile branding. |
| Rider Profile (Jeevan H.) | `https://lh3.googleusercontent.com/aida/ALJJyrCwNqtA-Abwimqm_X7XNW7LUW3h0MLfVdZw-mKEMlabxoIfk3uXD0E8QV5CFcE0jJaxK0szJ8gbPyaEX-yWILSjAXCtkU86CUpzMlDO__og5Lu5bAQUtH58BrJkcjKU7n8T6_d8r7LSY0MFqmIZwU6hLfcC5dLFIid5ajnF2ay0RvnrirkDSkASdnhslamlp1b4FSv0N8q3BlzwOk0Q2eHVa1jz_Ou_DshTmfJZLA8o` | Header avatar & Profile screen |
| Auto Rickshaw Driver (Ramesh K.) | `https://lh3.googleusercontent.com/aida-public/AB6AXuB3740jxSGU_BvWXX_0bKvu2sxELLX3AAndNutnCW1XB__FwZwimVdQj4fOaPyFKYMsAmEUOU5b79mzMqvzX5ZGIkNXUzI4OJZrn2REKieiB-DgdiisKPKyBxEF61HkHHW9b1Rf_sTB4cKo6Q24dXC2eWjIJcG5MsBenwwv-U3LLkhaiFKpskZqBkUWS7J1dwK6Ti9Wt5E706pyHnAzMQpT4793gyOibANPEYB0dnw` | Booking confirmation driver pod |
| Driver Alternative (Santhosh M.) | `https://lh3.googleusercontent.com/aida-public/AB6AXuBFC_47gt-3lPsOkq5tq9A1wWjAanAGLT6QZO8F3aTw1LfNOksrrxtXPF71CGQ_FJ7pd2LCtqBQDSpXdXwOpey0sE6qNx6fucroCvNH0h6iro5jb2ysLyvNzFo1738hYjEHq4Swjk-8vLvooNWxWoVptliHy445jMIRy5KQxPdsJiOuxf15CvmmGzGTG3p2hxjjR4GDmV5Xy9khm4tVw1cxiuqqOxQX-FwykOSgEZM` | Live Tracking driver portrait |
| Auto Rickshaw Vehicle Icon | `https://lh3.googleusercontent.com/aida-public/AB6AXuCGpm9AeQiLQG5LlVHb7EORaevjaqZ1oTwZRFLe2w-g9ln09iPFCctXR70CNGfrMtujRzt3ugtB_4MhMdkGq698IXwUIhmJE-VXTGbMG2u4SCfHerWXhruYnnZEsseZj4T16u1lx2xBYsIM6aSztUN8Qx7TPc_pHhk_zWD0g4fVHdgk4CHpWPui_y9GE4TtRK4ZEp2wlSOuHfnIacHeiUiifs0yp2LWv4OqayF-9iY` | Vehicle Options (Auto) |
| Mini Hatchback Vehicle Icon | `https://lh3.googleusercontent.com/aida-public/AB6AXuCZJfUqQkJFghgZADqli2xaHfNEHX0jU0iax2aksqptqZC25FfypSO8Gz7JRaAuahfMFqegLAnayF0QBAwlsGSgitztasxWadQtLaj3sETr4R9du2MuY9R8LwHZp2b1qcRGKr-btYB9r22yrrNlzlkVV2EjkL0w10t8sbUER6Pp_OQl9f4N-RgM8dIDXNRjmCSTSeAPZsfDdkdM4W35_-y1xcEAQ_52OvLtObZBzQI` | Vehicle Options (Mini) |
| Sedan Comfort Vehicle Icon | `https://lh3.googleusercontent.com/aida-public/AB6AXuBEQGdaqpK4uMsCxH32_81v-AWAwHK-OYkVaAWmhLN6MQ_Kb4nu0Ds_wqw6R8nY8bYA7v-40LP5Blaa9YoPyxTJCvYVZkYw1ZaWUMrn0By6_fLg6ZaaAE6iVvdNBcFNtP5eHb6f7kh6tLN49PtXbEyek_Rwh7cmVGQ50PXyhjDUBkfUVdx_f5RhLXxqfx8XZHVMdtIAFaNyBm0NfIHTGI2OTtCiLdxYCAPfc1p7qms` | Vehicle Options (Sedan) |
| SUV Extra Vehicle Icon | `https://lh3.googleusercontent.com/aida-public/AB6AXuB3s58WZXFPYiIC2s4j-U5YtUKAKpikVbTnWap-mOLmRCOCS5l80Ov3SpHJod0DXLyG0gHquUqgBmxRGL5utBB-rzd9yE9t-ePbpoc4h_tOpbPB02q6yHN4240Lj1E-b3meWChrq0L-0ZTGjRQNVv4SJ04NSOZiVdGasTRYQDKVGKzhIO5gSv6iLqnZhZtGiJ6e7JKHPpyhx5vs9MxTJ2wPMA18OHygyNVBhCipHr4` | Vehicle Options (SUV) |
| JSS Hospital Destination Image | `https://lh3.googleusercontent.com/aida-public/AB6AXuB4aBG4_Zth2cyMUEY9o1ZdkvoKIXdgmW2VKUGDa7yfJF2IpW7pdewTuD-7YQt5CTZ2OO6gGbM35R4ZAJU-MVkh-2zzqplT_sS_A6BKXRPOI2xmB4rF-kXaBfmZby5jHMO_VynSj-zL8QwlE31CphabAl6HFcDWzhnIpvbmMg-qcidZ_UfSnqonMauj1Bfs6SFwR6DBl_z-5DSWoTSwklzdMQtvgmEix9nzPP3p8-o` | Destination Search Item 1 |
| Mysuru Railway Station Image | `https://lh3.googleusercontent.com/aida-public/AB6AXuAWCdro_M8-gy6hjaiF_1Ez9HEA5gODnaOKNqoO22am6QYUD5hhzPj8l6PZ9l5viMhaPNFSGHDrP6h787TAuz9Rc_-53MC1f-eVxpffSIhnoSiEHZ5N54l1YjMMP-vjpmQbqCbKlxIbjwyu9WkduTg2a073IqP-7K5CHVpnr-pg5m9O32Oa0YOgEO5YAT33Dhg3uOFgcBB62MfrFvgfsOqY9BYzjCGY-r5cssQ-7-U` | Destination Search Item 2 |
| Mysuru Palace Image | `https://lh3.googleusercontent.com/aida-public/AB6AXuDvBXGv3apiDmTts6j9-SdNT9zyWceTbb3XqfXatKxVRf7-lQduZaqb1YNThaBMytdtCV_XX1SLogRLuWsoX13LizJWKojCzK4JsmC6CwMLN0UZBpd8psBAmhuUzVvm39XTzhRXGmQe1wJ1djfMQoTldCNo3Nth-_XArMNPnOWk6GAkSSPKjMti5z_1UR1gFLHMu2_zmzAGvbdfsWnmrJ8Ro6WI3p1FovwkGMt5PI4` | Destination Search Item 3 |
| Live Tracking Night Backdrop | `https://lh3.googleusercontent.com/aida-public/AB6AXuAR14LwIzODwREc7VJdauHoAZPSGX2tvIOWN3xuqii1yjmR8YrRbaRZNLXDLc4udAwpJQKyDjVn-2A4SPReiLkpz2gr_kuc-AtqUYHaws_Etpb2YtK9Tb1Owzw9Hcdzxlfqc6Jov7c9lYhv8lrQU9uDndCtapg9yjqcu-FOh9A-v2jFrUZnQ-4aZWWy0vu5nJy5gRDmJm7407xI-XdnJiKpP7qozu-uFnoyxr18IB8` | Live Ride Tracking Map Canvas |

