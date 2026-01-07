DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM games;

ALTER TABLE games ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.0 CHECK (rating >= 0 AND rating <= 5);

INSERT INTO games (title, price, stock, image_url, rating) VALUES
('The Legend of Zelda: Breath of the Wild', 59.99, 50, 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58', 4.8),
('Red Dead Redemption 2', 49.99, 30, 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg', 4.9),
('Cyberpunk 2077', 39.99, 25, 'https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/cKZ4tKNFj9C00giTzYtH8PF1.png', 3.8),
('Elden Ring', 59.99, 40, 'https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/aGhopp3MHppi7kooGE2Dtt8C.png', 4.7),
('God of War', 49.99, 35, 'https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg', 4.9),
('Minecraft', 26.95, 150, 'https://www.minecraft.net/content/dam/games/minecraft/key-art/Games_Subnav_Minecraft-300x465.jpg', 4.6),
('Grand Theft Auto V', 29.99, 80, 'https://media.rockstargames.com/rockstargames-newsite/img/global/games/fob/640/V.jpg', 4.7),
('The Witcher 3: Wild Hunt', 39.99, 60, 'https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MUIuMmHlktOHar3lVl6rY.png', 4.8),
('Valorant - Starter Pack', 9.99, 200, 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/54d784be3db8503ec574ff45e912ea098cc10352-854x484.png', 4.3),
('League of Legends - RP Card', 10.00, 300, 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg', 4.5);

SELECT * FROM games ORDER BY id;

