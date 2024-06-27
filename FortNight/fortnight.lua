-- Fortnite GG Script
-- This script is for educational purposes only

-- Function to modify health
function modifyHealth()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("100", gg.TYPE_DWORD) -- Search for the current amount of health (change this number to match your current health)
  gg.getResults(100)
  gg.editAll("999", gg.TYPE_DWORD) -- Set the health to 999
  gg.toast("Health modified successfully!")
end

-- Function to modify shield
function modifyShield()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("100", gg.TYPE_DWORD) -- Search for the current amount of shield (change this number to match your current shield)
  gg.getResults(100)
  gg.editAll("999", gg.TYPE_DWORD) -- Set the shield to 999
  gg.toast("Shield modified successfully!")
end

-- Function to modify ammo
function modifyAmmo()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("30", gg.TYPE_DWORD) -- Search for the current amount of ammo in a clip (change this number to match your current ammo)
  gg.getResults(100)
  gg.editAll("999", gg.TYPE_DWORD) -- Set the ammo to 999
  gg.toast("Ammo modified successfully!")
end

-- Main menu
function mainMenu()
  local menu = gg.choice({
    "Modify Health",
    "Modify Shield",
    "Modify Ammo",
    "Exit"
  }, nil, "Fortnite GG Script")
  
  if menu == 1 then
    modifyHealth()
  elseif menu == 2 then
    modifyShield()
  elseif menu == 3 then
    modifyAmmo()
  elseif menu == 4 then
    gg.toast("Exiting script...")
    os.exit()
  end
end

-- Run the main menu function
mainMenu()
