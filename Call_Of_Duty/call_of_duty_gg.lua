-- Call of Duty GG Script
-- This script is for educational purposes only

-- Function to modify ammo
function modifyAmmo()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("30", gg.TYPE_DWORD) -- Search for the current amount of ammo in a clip (change this number to match your current ammo)
  gg.getResults(100)
  gg.editAll("999", gg.TYPE_DWORD) -- Set the ammo to 999
  gg.toast("Ammo modified successfully!")
end

-- Function to modify health
function modifyHealth()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("100", gg.TYPE_DWORD) -- Search for the current amount of health (change this number to match your current health)
  gg.getResults(100)
  gg.editAll("9999", gg.TYPE_DWORD) -- Set the health to 9999
  gg.toast("Health modified successfully!")
end

-- Function to unlock all weapons
function unlockAllWeapons()
  gg.setRanges(gg.REGION_ANONYMOUS)
  gg.searchNumber("0", gg.TYPE_DWORD) -- This is a simplified example; the actual search criteria will vary
  gg.getResults(100)
  gg.editAll("1", gg.TYPE_DWORD) -- Unlock all weapons (this is just an example and may not work for all items)
  gg.toast("All weapons unlocked!")
end

-- Main menu
function mainMenu()
  local menu = gg.choice({
    "Modify Ammo",
    "Modify Health",
    "Unlock All Weapons",
    "Exit"
  }, nil, "Call of Duty GG Script")
  
  if menu == 1 then
    modifyAmmo()
  elseif menu == 2 then
    modifyHealth()
  elseif menu == 3 then
    unlockAllWeapons()
  elseif menu == 4 then
    gg.toast("Exiting script...")
    os.exit()
  end
end

-- Run the main menu function
mainMenu()
