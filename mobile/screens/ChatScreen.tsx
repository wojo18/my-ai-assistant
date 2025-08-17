import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { apiAsk } from '../lib/api';

export default function ChatScreen(){
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<{role:'user'|'assistant';content:string}[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if(!input.trim()) return;
    const p = input.trim(); setInput('');
    setMsgs(m=>[...m,{role:'user',content:p}]);
    setLoading(true);
    try {
      const a = await apiAsk(p);
      setMsgs(m=>[...m,{role:'assistant',content:a}]);
    } finally { setLoading(false); }
  };

  return (
    <View style={{ flex:1, padding:16 }}>
      <ScrollView style={{ flex:1 }}>
        {msgs.map((m,i)=> (
          <View key={i} style={{ marginBottom:8 }}>
            <Text style={{ fontWeight:'bold' }}>{m.role==='user'?'Ty':'AI'}</Text>
            <Text>{m.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ flexDirection:'row', gap:8 }}>
        <TextInput style={{ flex:1, borderWidth:1, padding:8 }} value={input} onChangeText={setInput} placeholder="Napisz..." />
        <Button title={loading? '...' : 'Wyślij'} onPress={send} />
      </View>
    </View>
  );
}
