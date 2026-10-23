import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, StyleSheet, Alert } from "react-native";

const demoMatches = [
  { id: "1", league: "DEMO • Ligue", home: "Équipe A", away: "Équipe B", date: "Aujourd'hui • 18:00", p1: 52, px: 27, p2: 21, pick: "1", score: "1–0", note: "Avantage estimé à domicile", source: "demo" },
  { id: "2", league: "DEMO • Ligue", home: "Équipe C", away: "Équipe D", date: "Aujourd'hui • 20:00", p1: 34, px: 30, p2: 36, pick: "X2", score: "1–1", note: "Rencontre équilibrée", source: "demo" },
  { id: "3", league: "DEMO • Coupe", home: "Équipe E", away: "Équipe F", date: "Demain • 16:30", p1: 61, px: 23, p2: 16, pick: "1", score: "2–0", note: "Favori théorique à domicile", source: "demo" },
];
const copy = {
  fr: {
    tagline: "Analyses football • version démo", demo: "DÉMO", predictions: "Pronostics", method: "Méthode", history: "Historique", premium: "Premium",
    title: "Pronostics de démonstration", subtitle: "Les équipes, horaires et probabilités ci-dessous sont fictifs.",
    all: "Tous", confidence: "Confiance ≥ 40%", favorites: "Favoris", home: "Domicile", draw: "Nul", away: "Extérieur",
    choice: "Choix indicatif", score: "Score estimé", warning: "À savoir", warningText: "Ces chiffres sont fictifs, pas des pronostics réels. Les probabilités ne garantissent aucun résultat ni gain.",
    methodTitle: "Comment lire les probabilités", methodText: "1 = victoire à domicile. X = match nul. 2 = victoire à l'extérieur. Les données réelles devront provenir d'une source fiable et les modèles devront être testés sur des matchs non utilisés pour leur création.",
    responsible: "Joue avec prudence", responsibleText: "Aucun modèle ne garantit une victoire. Ne mise jamais l'argent nécessaire aux dépenses essentielles.",
    historyTitle: "Historique", historyText: "L'historique des résultats sera disponible après connexion à une source de matchs réels et validation des résultats.",
    premiumTitle: "PronoPro BF Premium", premiumText: "La version Premium pourra proposer des analyses détaillées, des filtres avancés et un historique enrichi. Aucun avantage ne garantit un gain.",
    premiumStatus: "Aucun abonnement n'est activé dans ce prototype.", free: "Version gratuite", manualTitle: "Ajouter un pronostic manuel",
    homePlaceholder: "Équipe à domicile", awayPlaceholder: "Équipe à l'extérieur", leaguePlaceholder: "Compétition", add: "Ajouter à la liste",
    manual: "Saisie manuelle", automatic: "Exemples automatiques", manualHelp: "Ajoute une affiche pour tester l'interface. Les probabilités sont des valeurs neutres de démonstration.",
    added: "Pronostic ajouté à la démo", fill: "Saisis les deux équipes.", footer: "Indépendant • Non affilié à 1xBet",
    lang: "FR", freeInfo: "GRATUIT", premiumInfo: "APERÇU PREMIUM"
  },
  en: {
    tagline: "Football analysis • demo version", demo: "DEMO", predictions: "Predictions", method: "Method", history: "History", premium: "Premium",
    title: "Demo predictions", subtitle: "Teams, times and probabilities below are fictional.",
    all: "All", confidence: "Confidence ≥ 40%", favorites: "Favorites", home: "Home", draw: "Draw", away: "Away",
    choice: "Indicative pick", score: "Estimated score", warning: "Please note", warningText: "These figures are fictional, not real predictions. Probabilities do not guarantee any result or winnings.",
    methodTitle: "How to read probabilities", methodText: "1 = home win. X = draw. 2 = away win. Real data must come from a reliable source, and models should be tested on matches not used to build them.",
    responsible: "Bet responsibly", responsibleText: "No model guarantees a win. Never stake money needed for essential expenses.",
    historyTitle: "History", historyText: "Results history will be available after connecting a real fixtures source and verifying results.",
    premiumTitle: "PronoPro BF Premium", premiumText: "Premium may offer detailed analysis, advanced filters and an extended history. No feature guarantees winnings.",
    premiumStatus: "No subscription is active in this prototype.", free: "Free version", manualTitle: "Add a manual prediction",
    homePlaceholder: "Home team", awayPlaceholder: "Away team", leaguePlaceholder: "Competition", add: "Add to list",
    manual: "Manual entry", automatic: "Demo examples", manualHelp: "Add a fixture to test the interface. Probabilities are neutral demo values.",
    added: "Prediction added to demo", fill: "Enter both team names.", footer: "Independent • Not affiliated with 1xBet",
    lang: "EN", freeInfo: "FREE", premiumInfo: "PREMIUM PREVIEW"
  }
};

function Pill({ children, active, onPress }) {
  return <TouchableOpacity onPress={onPress} style={[styles.pill, active && styles.pillActive]}><Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text></TouchableOpacity>;
}
function MatchCard({ item, t }) {
  return <View style={styles.card}>
    <Text style={styles.league}>{item.league}</Text><Text style={styles.date}>{item.date}</Text>
    <View style={styles.teams}><Text style={styles.team}>{item.home}</Text><Text style={styles.vs}>VS</Text><Text style={styles.team}>{item.away}</Text></View>
    <View style={styles.probs}>
      <View style={styles.prob}><Text style={styles.probLabel}>{t.home} (1)</Text><Text style={styles.probValue}>{item.p1}%</Text></View>
      <View style={styles.prob}><Text style={styles.probLabel}>{t.draw} (X)</Text><Text style={styles.probValue}>{item.px}%</Text></View>
      <View style={styles.prob}><Text style={styles.probLabel}>{t.away} (2)</Text><Text style={styles.probValue}>{item.p2}%</Text></View>
    </View>
    <View style={styles.pickRow}><Text style={styles.pickLabel}>{t.choice}</Text><Text style={styles.pick}>{item.pick}</Text><Text style={styles.score}>{t.score}: {item.score}</Text></View>
    <Text style={styles.note}>{item.note}</Text>
  </View>;
}
export default function App() {
  const [language, setLanguage] = useState("fr");
  const t = copy[language];
  const [tab, setTab] = useState("predictions");
  const [filter, setFilter] = useState("all");
  const [mode, setMode] = useState("auto");
  const [manual, setManual] = useState([]);
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");
  const [league, setLeague] = useState("");
  const allMatches = useMemo(() => [...manual, ...demoMatches], [manual]);
  const filtered = useMemo(() => allMatches.filter(m => filter === "all" || (filter === "favorites" ? m.p1 >= 50 || m.p2 >= 50 : Math.max(m.p1, m.px, m.p2) >= 40)), [allMatches, filter]);
  function addManual() {
    if (!home.trim() || !away.trim()) { Alert.alert("PronoPro BF", t.fill); return; }
    const item = { id: String(Date.now()), league: league.trim() || "MANUAL", home: home.trim(), away: away.trim(), date: language === "fr" ? "Saisie manuelle" : "Manual entry", p1: 33, px: 34, p2: 33, pick: "À analyser", score: "—", note: t.manualHelp, source: "manual" };
    setManual(prev => [item, ...prev]); setHome(""); setAway(""); setLeague("");
    Alert.alert("PronoPro BF", t.added);
  }
  return <SafeAreaView style={styles.safe}>
    <StatusBar barStyle="light-content" backgroundColor="#07130f" />
    <View style={styles.header}>
      <View><Text style={styles.brand}>PRONO<Text style={styles.brandAccent}>PRO</Text> BF</Text><Text style={styles.tagline}>{t.tagline}</Text></View>
      <View style={styles.headerRight}><TouchableOpacity style={styles.lang} onPress={() => setLanguage(language === "fr" ? "en" : "fr")}><Text style={styles.langText}>{t.lang} / {language === "fr" ? "EN" : "FR"}</Text></TouchableOpacity><View style={styles.live}><View style={styles.dot}/><Text style={styles.liveText}>{t.demo}</Text></View></View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nav}>
      {[["predictions",t.predictions],["method",t.method],["history",t.history],["premium",t.premium]].map(([key,label]) => <Pill key={key} active={tab===key} onPress={() => setTab(key)}>{label}</Pill>)}
    </ScrollView>
    <ScrollView contentContainerStyle={styles.content}>
      {tab === "predictions" ? <>
        <Text style={styles.heading}>{t.title}</Text><Text style={styles.subheading}>{t.subtitle}</Text>
        <View style={styles.filters}>{[[ "all",t.all],["confidence",t.confidence],["favorites",t.favorites]].map(([key,label])=><Pill key={key} active={filter===key} onPress={() => setFilter(key)}>{label}</Pill>)}</View>
        <View style={styles.modeRow}><Pill active={mode==="auto"} onPress={() => setMode("auto")}>{t.automatic}</Pill><Pill active={mode==="manual"} onPress={() => setMode("manual")}>{t.manual}</Pill></View>
        {mode === "manual" && <View style={styles.card}>
          <Text style={styles.formTitle}>{t.manualTitle}</Text>
          <TextInput value={home} onChangeText={setHome} placeholder={t.homePlaceholder} placeholderTextColor="#789080" style={styles.input}/>
          <TextInput value={away} onChangeText={setAway} placeholder={t.awayPlaceholder} placeholderTextColor="#789080" style={styles.input}/>
          <TextInput value={league} onChangeText={setLeague} placeholder={t.leaguePlaceholder} placeholderTextColor="#789080" style={styles.input}/>
          <Text style={styles.note}>{t.manualHelp}</Text>
          <TouchableOpacity style={styles.addButton} onPress={addManual}><Text style={styles.addButtonText}>{t.add}</Text></TouchableOpacity>
        </View>}
        {filtered.map(item => <MatchCard key={item.id} item={item} t={t}/>)}
        <View style={styles.warning}><Text style={styles.warningTitle}>{t.warning}</Text><Text style={styles.warningText}>{t.warningText}</Text></View>
      </> : tab === "method" ? <>
        <Text style={styles.heading}>{t.methodTitle}</Text><View style={styles.card}><Text style={styles.body}>{t.methodText}</Text></View>
        <View style={styles.warning}><Text style={styles.warningTitle}>{t.responsible}</Text><Text style={styles.warningText}>{t.responsibleText}</Text></View>
      </> : tab === "history" ? <>
        <Text style={styles.heading}>{t.historyTitle}</Text><View style={styles.card}><Text style={styles.body}>{t.historyText}</Text></View>
      </> : <>
        <Text style={styles.heading}>{t.premiumTitle}</Text><View style={styles.card}><Text style={styles.body}>{t.premiumText}</Text><View style={styles.premiumTag}><Text style={styles.premiumTagText}>{t.premiumInfo}</Text></View><Text style={styles.note}>{t.premiumStatus}</Text></View>
        <View style={styles.card}><Text style={styles.formTitle}>{t.free}</Text><Text style={styles.body}>{t.warningText}</Text></View>
      </>}
      <Text style={styles.footer}>PronoPro BF • {t.footer}</Text>
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
 safe:{flex:1,backgroundColor:"#07130f"},header:{paddingHorizontal:18,paddingTop:14,paddingBottom:12,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},brand:{fontSize:24,fontWeight:"900",letterSpacing:1,color:"#f4fff8"},brandAccent:{color:"#4ade80"},tagline:{color:"#9db5a8",fontSize:11,marginTop:3},headerRight:{alignItems:"flex-end",gap:6},lang:{borderWidth:1,borderColor:"#345541",borderRadius:15,paddingHorizontal:9,paddingVertical:5},langText:{color:"#d7e7dc",fontSize:10,fontWeight:"800"},live:{flexDirection:"row",alignItems:"center",backgroundColor:"#142b20",paddingVertical:5,paddingHorizontal:9,borderRadius:20},dot:{width:6,height:6,borderRadius:5,backgroundColor:"#facc15",marginRight:5},liveText:{color:"#facc15",fontWeight:"800",fontSize:9},
 nav:{paddingHorizontal:12,paddingBottom:12,gap:6},pill:{paddingVertical:9,paddingHorizontal:11,borderRadius:18,backgroundColor:"#14231c",borderWidth:1,borderColor:"#24392d",marginRight:4},pillActive:{backgroundColor:"#4ade80",borderColor:"#4ade80"},pillText:{color:"#b9c9bf",fontSize:11,fontWeight:"700"},pillTextActive:{color:"#062012"},
 content:{paddingHorizontal:15,paddingBottom:28},heading:{color:"#f4fff8",fontSize:22,fontWeight:"800",marginTop:8},subheading:{color:"#9db5a8",fontSize:12,marginTop:5,marginBottom:13},filters:{flexDirection:"row",flexWrap:"wrap",gap:3,marginBottom:10},modeRow:{flexDirection:"row",gap:5,marginBottom:12},
 card:{backgroundColor:"#102019",borderColor:"#20392b",borderWidth:1,borderRadius:16,padding:14,marginBottom:12},league:{color:"#4ade80",fontWeight:"800",fontSize:10,letterSpacing:.7},date:{color:"#9db5a8",fontSize:10,marginTop:4},teams:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:15,marginBottom:14},team:{color:"#f4fff8",fontSize:13,fontWeight:"800",flex:1,textAlign:"center"},vs:{color:"#6f8a7a",fontSize:9,fontWeight:"800",paddingHorizontal:6},
 probs:{flexDirection:"row",gap:6},prob:{flex:1,backgroundColor:"#192e23",borderRadius:9,padding:8,alignItems:"center"},probLabel:{color:"#91aa9a",fontSize:9,fontWeight:"700",textAlign:"center"},probValue:{color:"#f4fff8",fontSize:16,fontWeight:"900",marginTop:3},pickRow:{flexDirection:"row",alignItems:"center",marginTop:12,gap:7},pickLabel:{color:"#9db5a8",fontSize:10},pick:{backgroundColor:"#4ade80",color:"#062012",fontWeight:"900",overflow:"hidden",paddingHorizontal:8,paddingVertical:4,borderRadius:6,fontSize:10},score:{color:"#d7e7dc",fontSize:10,marginLeft:"auto"},note:{color:"#a8bdb0",fontSize:10,marginTop:9,lineHeight:15},warning:{backgroundColor:"#2a2414",borderColor:"#59471d",borderWidth:1,borderRadius:13,padding:13,marginTop:3},warningTitle:{color:"#facc15",fontWeight:"900",marginBottom:5},warningText:{color:"#e5d9b5",fontSize:11,lineHeight:17},body:{color:"#d8e7dd",fontSize:13,lineHeight:21,marginBottom:10},footer:{color:"#708a7a",textAlign:"center",fontSize:9,marginTop:14},formTitle:{color:"#f4fff8",fontSize:15,fontWeight:"800",marginBottom:10},input:{backgroundColor:"#0a1811",borderColor:"#2b4937",borderWidth:1,borderRadius:9,paddingHorizontal:11,paddingVertical:10,color:"#f4fff8",marginBottom:8,fontSize:13},addButton:{backgroundColor:"#4ade80",padding:12,borderRadius:10,alignItems:"center",marginTop:10},addButtonText:{color:"#062012",fontWeight:"900",fontSize:13},premiumTag:{alignSelf:"flex-start",backgroundColor:"#332a13",borderRadius:8,paddingHorizontal:9,paddingVertical:5,marginBottom:9},premiumTagText:{color:"#facc15",fontSize:10,fontWeight:"900"}
});
