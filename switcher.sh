#!/usr/bin/env bash

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

REPO_FOLDER="$HOME/Dev/Switcher"
data="$REPO_FOLDER/data.json"

BASE_WP="$HOME/Pictures/SWITCH/WP"
BASE_ICONS="$HOME/Pictures/SWITCH/ICNS"
BASE_SOUNDS="$HOME/Pictures/SWITCH/SOUNDS"
BASE_WIDGET="$HOME/Pictures/SWITCH/WIDGET"

SOUND_SABRINA="$BASE_SOUNDS/sabrina.mp3"
SOUND_NORMAL="$BASE_SOUNDS/normal.mp3"

NB_WIDGETS=18
CURRENT_THEME=$(jq -r '.theme // 1' "$data")

APPS_TO_ICON_SWITCH=("LidAngleSensor" "Open WebUI" "VLC" "Ollama" "Xcode" "osu!" "XQuartz" "Pages" "Numbers" "Keynote" "Gifski" "flipclock" "Android Studio" "Firefox" "Comet" "Visual Studio Code" "WhatsApp" "Spotify" "Discord" "VinylPod" "GIMP" "Steam" "Microsoft Excel" "Microsoft PowerPoint" "Microsoft Word" "Lunar Client" "JetBrains Toolbox" "Rider" "Telegram" "BlueStacks" "BlueStacksMIM" "Emacs" "Google Chrome" "Google Docs" "Google Drive" "Google Sheets" "Google Slides" "GPG Keychain" "HypeRCON" "Minecraft" "OBS" "TV Time" "Shop" "PopSQL" "WebStorm" "CLion" "Notion Calendar" "Studio" "Übersicht" "NordVPN" "Anytype" "Inkscape")

get_widget_config() {
    local widget_name="$1"
    local variant="$2"
    jq -cer --arg widget "$widget_name" --arg variant "$variant" '.widgets[$widget][$variant] // .widgets[$widget].normal // empty' "$data"
}

get_wallpaper_path() {
    local variant="$1"
    local relative_path
    local absolute_path

    relative_path=$(jq -r --arg variant "$variant" '.wallpaper[$variant] // empty' "$data")

    if [ -z "$relative_path" ] && [ "$variant" != "normal" ]; then
        relative_path=$(jq -r '.wallpaper.normal // empty' "$data")
    fi

    if [ -z "$relative_path" ]; then
        echo ""
        return
    fi

    absolute_path="$BASE_WP/$relative_path"
    [ -f "$absolute_path" ] && echo "$absolute_path" || echo ""
}

pick_random_color() {
    local count
    local last_index
    local random_index
    local selected_color

    count=$(jq -r '(.colors // []) | length' "$data")
    last_index=$(jq -r '.last_color // -1' "$data")

    if [ -z "$count" ] || [ "$count" -le 0 ]; then
        echo "blue"
        return
    fi

    if [ "$count" -gt 1 ] && [ "$last_index" -ge 0 ] && [ "$last_index" -lt "$count" ]; then
        if command -v jot >/dev/null 2>&1; then
            random_index=$(jot -r 1 0 $((count - 2)))
        else
            random_index=$(( (RANDOM + $(date +%s)) % (count - 1) ))
        fi

        selected_color=$(jq -r --argjson idx "$random_index" --argjson last "$last_index" '
            [(.colors // []) | to_entries[] | select(.key != $last) | .value] as $pool
            | $pool[$idx] // empty
        ' "$data")
    else
        if command -v jot >/dev/null 2>&1; then
            random_index=$(jot -r 1 0 $((count - 1)))
        else
            random_index=$(( (RANDOM + $(date +%s)) % count ))
        fi

        selected_color=$(jq -r --argjson idx "$random_index" '.colors[$idx] // empty' "$data")
    fi

    [ -n "$selected_color" ] && echo "$selected_color" || echo "blue"
}

get_heart_for_color() {
    local color=$(echo "$1" | tr '[:upper:]' '[:lower:]')

    case "$color" in
        blue|bleu) echo "💙" ;;
        red|rouge) echo "❤️ " ;;
        green|vert) echo "💚" ;;
        yellow|jaune|gold|orange) echo "💛" ;;
        pink|rose) echo "🩷" ;;
        purple|violet) echo "💜" ;;
        *) echo "💖" ;;
    esac
}

set_data_state() {
        local new_theme="$1"
        local selected_color="$2"

        if [ -n "$selected_color" ]; then
                jq --argjson theme "$new_theme" --arg color "$selected_color" '
                    .theme = $theme
                    | .last_color = ((.colors // []) | index($color) // 0)
                ' "$data" > "${data}.tmp" && mv "${data}.tmp" "$data"
        else
                jq --argjson theme "$new_theme" '.theme = $theme' "$data" > "${data}.tmp" && mv "${data}.tmp" "$data"
        fi
}

apply_theme_widgets() {
    local variant="$1"
    local clock_json
    local widget_json

    clock_json=$(get_widget_config "Clock" "$variant")
    [ -n "$clock_json" ] && set_clock_state "$clock_json"

    for widget_name in Music Logo Stats Lyrics Year Barcode Record Strip; do
            widget_json=$(get_widget_config "$widget_name" "$variant")
            [ -n "$widget_json" ] && set_widget_state "Widget${widget_name}" "$widget_json" ""
    done

    for i in $(seq 1 "$NB_WIDGETS"); do
            widget_json=$(get_widget_config "Photo$i" "$variant")

            if [ "$variant" = "normal" ]; then
                    img="$BASE_WIDGET/$i/normal.png"
                    [ ! -f "$img" ] && img="$BASE_WIDGET/$i/normal.gif"
            else
                    img="$BASE_WIDGET/$i/sabrina/${variant}.png"
                    [ ! -f "$img" ] && img="$BASE_WIDGET/$i/sabrina/${variant}.gif"
            fi

            [ -n "$widget_json" ] && set_widget_state "WidgetPhoto$i" "$widget_json" "$img"
    done
}

set_widget_state() {
  local folder_name="$1"
  local json_config="$2"
  local img_path="$3"
  
  local ubersicht_folder="$HOME/Library/Application Support/Übersicht/widgets/$folder_name"

  if [ -d "$ubersicht_folder" ]; then
      local filename="current.png"

      if [ -n "$img_path" ] && [ -f "$img_path" ]; then
          local ext="${img_path##*.}"
          filename="current.$ext"
          rm -f "$ubersicht_folder/current."*
          cp -f "$img_path" "$ubersicht_folder/$filename"
      fi

      local timestamp=$(date +%s)
      local clean_json=${json_config%\}} 
      
      echo "$clean_json, \"filename\": \"$filename\", \"timestamp\": \"$timestamp\"}" > "$ubersicht_folder/layout.json"
  else
      echo "⚠️  Dossier introuvable : $ubersicht_folder"
  fi
}

set_clock_state() {
  local json_config="$1"
  local ubersicht_folder="$HOME/Library/Application Support/Übersicht/widgets/WidgetClock"

  if [ -d "$ubersicht_folder" ]; then
      echo "$json_config" > "$ubersicht_folder/layout.json"
  fi
}

change_wallpaper() {
    osascript -e "tell application \"System Events\" to set picture of every desktop to \"$1\""
}

play_sound() {
    local sound_file="$1"
    if [ -f "$sound_file" ]; then
        afplay "$sound_file" &
    fi
}

change_terminal_theme() {
    local profile_name="$1"
    osascript -e "tell application \"Terminal\" to set current settings of front window to settings set \"$profile_name\""
}

swap_icons() {
    local theme_subfolder="$1"
    local source_folder="$BASE_ICONS/$theme_subfolder"
    local -a pids=()
    
    for app_name in "${APPS_TO_ICON_SWITCH[@]}"; do
        if [ "$app_name" == "Studio" ]; then
            app_path="/Applications/Studio 2.0/Studio.app"
        elif [ "$app_name" == "XQuartz" ]; then
            app_path="/Applications/Utilities/XQuartz.app"
        else
            app_path="/Applications/${app_name}.app"
        fi

        if [ ! -d "$app_path" ]; then
            echo "⚠️  App introuvable : $app_name"
            continue
        fi

        icon_path=""
        for ext in png icns jpg; do
            if [ -f "$source_folder/${app_name}.${ext}" ]; then
                icon_path="$source_folder/${app_name}.${ext}"
                break
            fi
        done

        if [ -z "$icon_path" ]; then
            echo "❓ Pas d'image pour $app_name dans $theme_subfolder"
            continue
        fi

        { sudo fileicon rm "$app_path" -q 2>/dev/null
          sudo fileicon set "$app_path" "$icon_path" -q 2>/dev/null
          sudo touch "$app_path"; } &
        pids+=($!)
    done

    wait "${pids[@]}" 2>/dev/null
}

setup_dock() {
    dockutil --remove all --no-restart

    dockutil --add "/System/Applications/Utilities/Terminal.app/" --no-restart >/dev/null 2>&1
    dockutil --add "/Applications/Anytype.app" --no-restart >/dev/null 2>&1
    dockutil --add "/Applications/Safari.app" --no-restart >/dev/null 2>&1
    dockutil --add "/Applications/Visual Studio Code.app" --no-restart >/dev/null 2>&1
    dockutil --add "/Applications/WhatsApp.app/" --no-restart >/dev/null 2>&1
    dockutil --add "/Applications/Spotify.app" --no-restart >/dev/null 2>&1
    
    killall Dock
}

sudo -v 

switch_to_sabrina() {
    COLOR=$1

    HEART_EMOJI=$(get_heart_for_color "$COLOR")
    WALLPAPER_PATH=$(get_wallpaper_path "$COLOR")
    echo "[$HEART_EMOJI] That's that me espresso..."

    play_sound "$SOUND_NORMAL"
    
    osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to false'
    [ -n "$WALLPAPER_PATH" ] && change_wallpaper "$WALLPAPER_PATH"
    swap_icons "Sabrina/$COLOR"
    setup_dock
    set_data_state 1 "$COLOR"
    apply_theme_widgets "$COLOR"
}

switch_to_normal() {
    WALLPAPER_PATH=$(get_wallpaper_path "normal")
    echo "[🖤] Retour vers le mode NORMAL..."

    play_sound "$SOUND_NORMAL"
    
    osascript -e 'tell application "System Events" to tell appearance preferences to set dark mode to false'
    [ -n "$WALLPAPER_PATH" ] && change_wallpaper "$WALLPAPER_PATH"
    swap_icons "Normal"
    setup_dock
    set_data_state 0 ""
    apply_theme_widgets "normal"
}

if [[ "${1:-}" == "force" ]]; then
    if [[ "${2:-}" != "normal" ]]; then
        switch_to_sabrina "$2"
    else
        switch_to_normal
    fi
else
    if [ "$CURRENT_THEME" -eq 0 ]; then
        RANDOM_COLOR=$(pick_random_color)
    else
        switch_to_normal
    fi
fi

sudo rm -rfv /Library/Caches/com.apple.iconservices.store >/dev/null 2>&1
sudo find /private/var/folders/ -name com.apple.dock.iconcache -exec rm {} \; >/dev/null 2>&1

pkill -f "Übersicht"
sleep 0.5
open "/Applications/Übersicht.app"

killall Finder
# killall Terminal
