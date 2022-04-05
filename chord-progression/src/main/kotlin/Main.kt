import org.jfugue.player.Player
import javax.sound.midi.MidiSystem


fun main(args: Array<String>) {
    //"C","D","Eb","F","G","Ab","Bb"
    // 0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22
    val player = Player()
    val chords = arrayOf(
        arrayOf(0, 3, 7),
        //arrayOf(3, 7, 12),
        //arrayOf(7, 12, 15),
        arrayOf(2, 5, 8),
        //arrayOf(5, 8, 14),
        //arrayOf(8, 14, 17),
        arrayOf(3, 7, 10),
        //arrayOf(7, 10, 15),
        //arrayOf(10, 15, 19),
        arrayOf(5, 8, 12),
        //arrayOf(8, 12, 17),
        //arrayOf(12, 17, 20),
        arrayOf(7, 10, 14),
        //arrayOf(10, 14, 19),
        //arrayOf(14, 19, 22),
        arrayOf(8, 12, 15),
        //arrayOf(12, 15, 20),
        //arrayOf(15, 20, 24),
        arrayOf(10, 14, 17),
        //arrayOf(14, 17, 22),
        //arrayOf(17, 22, 26),
        arrayOf(12, 15, 19),
        //arrayOf(15, 19, 24),
        //arrayOf(19, 24, 27),
        arrayOf(14, 17, 20),
        //arrayOf(17, 20, 26),
        //arrayOf(20, 26, 29)
    )

    val mappedChords = chords.map { chord -> chord.map { note -> note + 5*12 } }
    val map = mutableMapOf<List<Int>, MutableList<List<Int>>>();
    mappedChords.forEach { chord -> map[chord] = mutableListOf() }
    map.keys.forEach { key -> mappedChords.forEach { chord ->
        var answer: String? = "r"
        while(answer == "r") {
            player.play(key.joinToString("+") { note -> "$note" + "w" }, chord.joinToString("+") { note -> "$note" + "w" })
            print("Like it? (y)es, (n)o, (r)epeat: ")
            answer = readLine()
        }
        if (answer == "y") {
            map[key]!!.add(chord);
        }
    } }

    print(map)
}