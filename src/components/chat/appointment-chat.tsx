'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth-provider';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

interface AppointmentChatProps {
  appointmentId: string;
  doctorId: string | null;
  patientId: string;
}

export function AppointmentChat({ appointmentId, doctorId, patientId }: AppointmentChatProps) {
  const { user: currentUser } = useAuth();
  const firestore = useFirestore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user: doctor } = useUser(doctorId || '');
  const { user: patient } = useUser(patientId);

  const otherUser = currentUser?.uid === patientId ? doctor : patient;

  useEffect(() => {
    if (!firestore || !appointmentId) return;

    const messagesRef = collection(firestore, 'appointments', appointmentId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(messagesData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error listening to messages:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, appointmentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !firestore || !currentUser || isSending) return;

    setIsSending(true);
    try {
      const messagesRef = collection(firestore, 'appointments', appointmentId, 'messages');
      await addDoc(messagesRef, {
        senderId: currentUser.uid,
        text: newMessage.trim(),
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (!doctorId) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px] text-center">
          <div className="space-y-2">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">
              El chat estará disponible cuando un doctor acepte tu solicitud.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.profilePictureURL} alt={otherUser?.firstName} />
            <AvatarFallback>
              {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">
              {otherUser?.firstName} {otherUser?.lastName}
            </CardTitle>
            <CardDescription>
              {currentUser?.uid === patientId ? 'Doctor' : 'Paciente'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay mensajes todavía. <br />
                Sé el primero en escribir.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === currentUser?.uid;
              return (
                <div
                  key={message.id}
                  className={cn('flex gap-3', isOwn ? 'flex-row-reverse' : 'flex-row')}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                      src={isOwn ? currentUser?.profilePictureURL : otherUser?.profilePictureURL}
                      alt={isOwn ? currentUser?.firstName : otherUser?.firstName}
                    />
                    <AvatarFallback className="text-xs">
                      {isOwn
                        ? `${currentUser?.firstName?.[0]}${currentUser?.lastName?.[0]}`
                        : `${otherUser?.firstName?.[0]}${otherUser?.lastName?.[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn('flex flex-col max-w-[70%]', isOwn ? 'items-end' : 'items-start')}>
                    <div
                      className={cn(
                        'rounded-lg px-4 py-2',
                        isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    </div>
                    {message.timestamp && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp?.toDate
                          ? formatDistanceToNow(message.timestamp.toDate(), {
                              addSuffix: true,
                              locale: es,
                            })
                          : message.timestamp?.seconds
                          ? formatDistanceToNow(new Date(message.timestamp.seconds * 1000), {
                              addSuffix: true,
                              locale: es,
                            })
                          : 'Ahora'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              disabled={isSending}
              className="flex-1"
            />
            <Button type="submit" disabled={isSending || !newMessage.trim()} size="icon">
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

